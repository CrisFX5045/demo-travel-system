import {
  ArrowLeftIcon,
  BookmarkIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import type { ElementType } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { useApiResource } from "@/app/api/hooks";
import { normalizeFavoriteExperiences } from "@/app/api/normalizers";
import { hasClientAccessToken } from "@/app/api/session";
import { travelerApi } from "@/app/api/services";
import { experiences } from "@/app/data/tourism";
import type { Experience } from "@/app/data/tourism";

import { ExperienceCardSkeleton } from "./components";
import { readFeedReactionMap } from "./feed/storage";
import { useScrollChrome } from "./hooks/useScrollChrome";
import { useClientI18n } from "./i18n";
import { getExperiencePath } from "./routes";

export default function ClientFavorites() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useClientI18n();
  const isAuthenticated = useMemo(() => hasClientAccessToken(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "favorites" | "saved"
  >("all");
  const { isMobileHeaderVisible } = useScrollChrome();
  const liked = readFeedReactionMap("liked");
  const saved = readFeedReactionMap("saved");
  const {
    data: apiFavorites,
    isLoading: isFavoritesLoading,
  } = useApiResource(() => travelerApi.getFavorites(), [], {
    enabled: isAuthenticated,
    requestKey: "client-favorites",
  });
  const favoriteExperiences =
    apiFavorites && normalizeFavoriteExperiences(apiFavorites).length > 0
      ? normalizeFavoriteExperiences(apiFavorites)
      : getSectionExperiences(liked);
  const savedExperiences = getSectionExperiences(saved);
  const visibleFavoriteExperiences = filterExperiences(
    favoriteExperiences,
    searchQuery,
  );
  const visibleSavedExperiences = filterExperiences(
    savedExperiences,
    searchQuery,
  );
  const showFavorites = activeFilter === "all" || activeFilter === "favorites";
  const showSaved = activeFilter === "all" || activeFilter === "saved";
  const returnTo = getReturnPath(location.state);

  const leaveFavorites = () => {
    navigate(returnTo);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/client/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <main
      className="min-h-screen w-full bg-white pb-[calc(5rem+env(safe-area-inset-bottom))] text-gray-950"
    >
      <header
        className={`fixed inset-x-0 top-0 z-30 border-b border-gray-100 bg-white/95 px-4 pb-4 pt-[calc(0.9rem+env(safe-area-inset-top))] backdrop-blur transition-transform duration-300 ease-out md:px-8 ${
          isMobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-5xl min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={leaveFavorites}
            className="grid size-10 place-items-center rounded-full bg-gray-100"
            aria-label={t("back")}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-gray-500">
              {language === "es" ? "Tu viaje" : "Your trip"}
            </p>
            <h1 className="truncate text-2xl font-extrabold">{t("favorites")}</h1>
          </div>
        </div>
      </header>
      <div className="h-[5.05rem]" />

      <div className="mx-auto w-full max-w-5xl px-4 py-5 md:px-8 md:py-6">
        <section className="mb-7">
          <div className="flex h-12 items-center gap-3 rounded-full bg-gray-100 px-4">
            <MagnifyingGlassIcon className="size-5 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchExperiences")}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 rounded-full bg-gray-100 p-1">
            {[
              { label: language === "es" ? "Todos" : "All", value: "all" },
              { label: t("favorites"), value: "favorites" },
              { label: language === "es" ? "Guardados" : "Saved", value: "saved" },
            ].map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter.value as typeof activeFilter)
                  }
                  className={`min-w-0 rounded-full px-3 py-2 text-sm font-extrabold transition ${
                    isActive
                      ? "bg-white text-gray-950 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  <span className="truncate">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {showFavorites && (
          <FavoriteSection
            title={t("favorites")}
            subtitle={
              language === "es"
                ? "Tus experiencias favoritas en un solo lugar."
                : "Your favorite experiences in one place."
            }
            icon={HeartSolidIcon}
            iconClassName="text-rose-600"
            emptyIcon={HeartIcon}
            emptyText={
              language === "es"
                ? "Aun no tienes favoritos."
                : "You do not have favorites yet."
            }
            experiences={visibleFavoriteExperiences}
            isLoading={isFavoritesLoading}
          />
        )}

        {showSaved && (
          <FavoriteSection
            title={language === "es" ? "Guardados" : "Saved"}
            subtitle={
              language === "es"
                ? "Experiencias que quieres revisar despues."
                : "Experiences you want to review later."
            }
            icon={BookmarkSolidIcon}
            iconClassName="text-yellow-400"
            emptyIcon={BookmarkIcon}
            emptyText={
              language === "es"
                ? "Aun no tienes guardados."
                : "You do not have saved experiences yet."
            }
            experiences={visibleSavedExperiences}
            isLoading={false}
          />
        )}
      </div>
    </main>
  );
}

function getReturnPath(state: unknown) {
  if (
    state &&
    typeof state === "object" &&
    "from" in state &&
    typeof state.from === "string" &&
    state.from.startsWith("/client")
  ) {
    return state.from;
  }

  return "/client";
}

function getSectionExperiences(
  storedMap: Record<string, boolean>,
) {
  return experiences.filter(
    (experience) => storedMap[experience.id],
  );
}

function filterExperiences(
  sourceExperiences: Experience[],
  searchQuery: string,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return sourceExperiences.filter((experience) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      [experience.title, experience.company, experience.province, experience.zone]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesSearch;
  });
}

function FavoriteSection({
  title,
  subtitle,
  icon: Icon,
  iconClassName,
  emptyIcon: EmptyIcon,
  emptyText,
  experiences,
  isLoading,
}: {
  title: string;
  subtitle: string;
  icon: ElementType;
  iconClassName: string;
  emptyIcon: ElementType;
  emptyText: string;
  experiences: Experience[];
  isLoading: boolean;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={`size-5 shrink-0 md:size-6 ${iconClassName}`} />
            <h2 className="truncate text-xl font-extrabold md:text-2xl">
              {title}
            </h2>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
            {subtitle}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-extrabold">
          {experiences.length}
        </span>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ExperienceCardSkeleton key={index} variant="grid" />
          ))}
        </div>
      ) : experiences.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              to={getExperiencePath(experience.id)}
              state={{ from: "/client/favorites" }}
              className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:rounded-3xl"
            >
              <img
                src={experience.image}
                alt=""
                className="aspect-[1.22] w-full object-cover sm:aspect-[1.15]"
              />
              <div className="p-3.5 md:p-4">
                <h3 className="line-clamp-1 text-lg font-extrabold">
                  {experience.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                  {experience.province} - {experience.duration}
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm font-bold">
                  <StarIcon className="size-4 fill-gray-950" />
                  {experience.rating}
                  <span className="font-semibold text-gray-400">
                    ({experience.reviews}+)
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid min-h-44 place-items-center rounded-3xl bg-gray-100 px-6 py-8 text-center">
          <div>
            <EmptyIcon className="mx-auto size-8 text-gray-400" />
            <p className="mt-3 text-sm font-bold text-gray-500">{emptyText}</p>
          </div>
        </div>
      )}
    </section>
  );
}
