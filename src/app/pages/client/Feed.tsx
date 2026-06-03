import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ChevronRightIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import {
  CLIENT_SESSION_EVENT,
  getClientSession,
  hasClientAccessToken,
} from "@/app/api/session";
import type { TravelerProfile } from "@/app/api/types";
import { provinces } from "@/app/data/tourism";
import { ClientAuthPrompt } from "./components";
import { navItems } from "./content";
import { FeedHeader, FeedViewport } from "./feed/components";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useFeedWindow } from "./feed/hooks/useFeedWindow";
import { useClientI18n } from "./i18n";

export default function ClientFeed() {
  const navigate = useNavigate();
  const { t, text } = useClientI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialExperienceId = searchParams.get("experience");
  const selectedProvince = searchParams.get("province") ?? "";
  const { liked, saved, toggleLiked, toggleSaved } = useFeedReactions();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => hasClientAccessToken(),
  );
  const [clientProfile, setClientProfile] = useState<TravelerProfile | null>(
    () => getStoredClientProfile(),
  );
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const {
    feedItems,
    isLoadingMore,
    trimmedBefore,
    handleActiveIndexChange,
  } = useFeedWindow(initialExperienceId, selectedProvince);

  const leaveFeed = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("client_home_entry", "from-feed");
    }

    navigate("/client");
  };
  const selectProvince = (province: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (province) {
      nextParams.set("province", province);
      nextParams.delete("experience");
    } else {
      nextParams.delete("province");
    }

    setSearchParams(nextParams, { replace: true });
  };
  const runReactionWhenAllowed = (action: () => void) => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }

    action();
  };

  useEffect(() => {
    const syncAuthStatus = () => {
      setIsAuthenticated(hasClientAccessToken());
      setClientProfile(getStoredClientProfile());
    };

    window.addEventListener(CLIENT_SESSION_EVENT, syncAuthStatus);

    return () => {
      window.removeEventListener(CLIENT_SESSION_EVENT, syncAuthStatus);
    };
  }, []);

  return (
    <main
      data-client-feed-entry
      className="h-svh w-full max-w-[100svw] overflow-hidden bg-gray-50 text-gray-950 [animation:client-feed-page-in_360ms_cubic-bezier(.22,1,.36,1)_both] dark:bg-black dark:text-white lg:bg-gray-100 lg:dark:bg-[#111]"
    >
      <FeedTransitionStyles />
      <FeedDesktopSidebar
        selectedProvince={selectedProvince}
        isAuthenticated={isAuthenticated}
        onSelectProvince={selectProvince}
        t={t}
        text={text}
      />
      <FeedAccountPanel
        isAuthenticated={isAuthenticated}
        profile={clientProfile}
        t={t}
      />
      <FeedHeader
        selectedProvince={selectedProvince}
        onBack={leaveFeed}
        onSelectProvince={selectProvince}
      />
      <div className="h-svh lg:pl-[21rem] lg:pr-[18rem]">
        <FeedViewport
          experiences={feedItems}
          isLoadingMore={isLoadingMore}
          initialExperienceId={initialExperienceId}
          liked={liked}
          trimmedBefore={trimmedBefore}
          saved={saved}
          onActiveIndexChange={handleActiveIndexChange}
          onToggleLiked={(experienceId) =>
            runReactionWhenAllowed(() => toggleLiked(experienceId))
          }
          onToggleSaved={(experienceId) =>
            runReactionWhenAllowed(() => toggleSaved(experienceId))
          }
        />
      </div>
      <ClientAuthPrompt
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
      />
    </main>
  );
}

function FeedDesktopSidebar({
  selectedProvince,
  isAuthenticated,
  onSelectProvince,
  t,
  text,
}: {
  selectedProvince: string;
  isAuthenticated: boolean;
  onSelectProvince: (province: string) => void;
  t: ReturnType<typeof useClientI18n>["t"];
  text: ReturnType<typeof useClientI18n>["text"];
}) {
  const selectedLabel = selectedProvince || t("anyLocation");
  const feedNavItems = navItems.map((item) => {
    if (item.label === "Explora") return { ...item, href: "/client" };
    if (item.label === "Mapa") return { ...item, href: "/client#map" };
    if (!isAuthenticated && (item.label === "Perfil" || item.label === "Favoritos")) {
      return { ...item, href: "/client/login" };
    }
    return item;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[21rem] border-r border-gray-200 bg-white px-5 py-5 text-gray-950 shadow-2xl shadow-gray-950/10 dark:border-white/10 dark:bg-[#151515] dark:text-white dark:shadow-black/30 lg:flex lg:flex-col">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/client"
          className="text-2xl font-extrabold transition hover:text-green-700 dark:hover:text-green-300"
        >
          TicaTour
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-100 p-4 dark:border-white/10 dark:bg-white/[0.06]">
        <p className="text-xs font-black uppercase text-gray-500 dark:text-white/45">
          {t("exploringIn")}
        </p>
        <div className="mt-2 flex items-center gap-2 text-lg font-extrabold">
          <MapPinIcon className="size-5 text-green-700 dark:text-green-300" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <select
          value={selectedProvince}
          onChange={(event) => onSelectProvince(event.target.value)}
          className="mt-3 h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm font-extrabold text-gray-950 outline-none transition hover:bg-gray-50 dark:border-white/10 dark:bg-black/25 dark:text-white dark:hover:bg-black/35"
        >
          <option value="">{t("anyLocation")}</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      <nav className="mt-6 grid gap-1">
        {feedNavItems.map((item) => {
          const isActive = item.label === "Feed";

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition active:scale-[0.98] ${
                isActive
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="size-5" />
                {text(item.label)}
              </span>
              <ChevronRightIcon className="size-4 opacity-60" />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-gray-200 bg-gray-100 p-4 text-sm font-bold leading-6 text-gray-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/60">
        {t("recommendedSubtitle")}
      </div>
    </aside>
  );
}

function FeedAccountPanel({
  isAuthenticated,
  profile,
  t,
}: {
  isAuthenticated: boolean;
  profile: TravelerProfile | null;
  t: ReturnType<typeof useClientI18n>["t"];
}) {
  const displayName = profile?.fullName || profile?.email || t("profile");
  const initials = getInitials(displayName);

  if (!isAuthenticated) {
    return (
      <aside className="fixed right-5 top-5 z-50 hidden w-[16rem] lg:block">
        <Link
          to="/client/login"
          className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-extrabold text-gray-950 shadow-2xl shadow-gray-950/10 transition hover:bg-gray-100 active:scale-[0.98] dark:border-white/10 dark:shadow-black/25"
        >
          {t("signIn")}
          <ChevronRightIcon className="size-4" />
        </Link>
      </aside>
    );
  }

  return (
    <aside className="fixed right-5 top-5 z-50 hidden w-[16rem] lg:block">
      <Link
        to="/client/profile"
        className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-gray-950 shadow-2xl shadow-gray-950/10 transition hover:bg-gray-100 active:scale-[0.98] dark:border-white/10 dark:shadow-black/25"
      >
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="size-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gray-950 text-sm font-black text-white">
            {initials}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-extrabold">
            {displayName}
          </span>
          <span className="block truncate text-xs font-bold text-gray-500">
            {t("profile")}
          </span>
        </span>
        <UserCircleIcon className="size-5 shrink-0 text-gray-400" />
      </Link>
    </aside>
  );
}

function getStoredClientProfile() {
  const profile = getClientSession()?.profile;
  return profile && typeof profile === "object"
    ? (profile as TravelerProfile)
    : null;
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "TT";
}

function FeedTransitionStyles() {
  return (
    <style>
      {`
        @keyframes client-feed-page-in {
          from {
            opacity: 0;
            transform: scale(1.01);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes client-feed-header-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-client-feed-entry],
          [data-client-feed-entry] * {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}
    </style>
  );
}
