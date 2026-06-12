import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useApiResource } from "@/app/api/hooks";
import {
  normalizeBookingExperiences,
  normalizeTravelerProfile,
} from "@/app/api/normalizers";
import { authApi, travelerApi } from "@/app/api/services";
import { getClientSession, hasClientAccessToken } from "@/app/api/session";
import type { Experience } from "@/app/data/tourism";

import { useScrollChrome } from "./hooks/useScrollChrome";
import { useClientI18n } from "./i18n";
import { BookingCardSkeleton, ProfileSummarySkeleton } from "./components";
import {
  BookingPreviewCard,
  ProfileActionList,
  ProfileHeader,
  ProfileSection,
  ProfileSettingsPanel,
  ProfileStats,
  TravelerSummary,
} from "./profile/components";
import {
  profileActions,
  profileCopy,
  supportActions,
} from "./profile/content";

const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000;

export default function ClientProfile() {
  const navigate = useNavigate();
  const { isMobileHeaderVisible } = useScrollChrome();
  const { language, t } = useClientI18n();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const copy = profileCopy[language];
  const isAuthenticated = useMemo(() => hasClientAccessToken(), []);
  const clientSession = useMemo(() => getClientSession(), []);
  const cachedProfile = useMemo(() => {
    const sessionProfile = clientSession?.profile;
    return sessionProfile ? normalizeTravelerProfile(sessionProfile) : null;
  }, [clientSession]);
  const shouldUseCachedProfileOnly =
    Boolean(cachedProfile?.id) &&
    clientSession?.profileNeedsRefresh !== true &&
    isRecentIsoDate(clientSession?.profileFetchedAt, PROFILE_CACHE_TTL_MS);
  const {
    data: profile,
    isLoading: isProfileLoading,
    setData: setProfile,
  } = useApiResource(() => authApi.getProfileMe(), [], {
    enabled: isAuthenticated && !shouldUseCachedProfileOnly,
    initialData: cachedProfile,
    requestKey: "client-profile-me",
  });
  const {
    data: upcomingBookings,
    isLoading: isUpcomingLoading,
  } = useApiResource(() => travelerApi.getBookings("upcoming"), [], {
    enabled: isAuthenticated,
    requestKey: "client-bookings-upcoming",
  });
  const {
    data: pastBookings,
    isLoading: isPastLoading,
  } = useApiResource(() => travelerApi.getBookings("past"), [], {
    enabled: isAuthenticated,
    requestKey: "client-bookings-past",
  });
  const hasRealProfile =
    Boolean(profile?.fullName) &&
    typeof profile?.profileCompletion === "number";
  const isIdentityVerified = profile?.isIdentityVerified ?? false;
  const upcomingTrips = useMemo(
    () => getBookingExperiences(upcomingBookings).slice(0, 3),
    [upcomingBookings],
  );
  const pastTrips = useMemo(
    () => getBookingExperiences(pastBookings).slice(0, 3),
    [pastBookings],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/client/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const logoutClient = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await authApi.logoutClient();
      navigate("/client", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen animate-[profile-page-in_520ms_ease-out_both] bg-[#f8f8f6] pb-[calc(5rem+env(safe-area-inset-bottom))] text-gray-950">
      <ProfileHeader
        title={copy.title}
        eyebrow={copy.eyebrow}
        backLabel={t("back")}
        isVisible={isMobileHeaderVisible}
        onBack={() => navigate("/client")}
      />
      <div className="h-[5.05rem]" />

      <div className="mx-auto grid w-full max-w-5xl animate-[profile-content-in_620ms_80ms_ease-out_both] items-start gap-4 px-4 py-5 md:grid-cols-[minmax(0,1fr)_20rem] md:px-8 md:py-6">
        <div className="grid content-start gap-4">
          {isProfileLoading || !hasRealProfile ? (
            <ProfileSummarySkeleton />
          ) : (
            <TravelerSummary
              copy={copy}
              isIdentityVerified={isIdentityVerified}
              fullName={profile?.fullName ?? ""}
              memberSince={profile?.memberSince}
              profileCompletion={profile?.profileCompletion ?? 0}
              avatarUrl={profile?.avatarUrl}
            />
          )}
          <ProfileStats
            copy={copy}
            stats={{
              trips: profile?.stats?.completedExperiences,
              favorites: profile?.stats?.favoriteExperiences,
              reviews: profile?.stats?.totalReviews,
            }}
            isLoading={isProfileLoading}
          />

          <ProfileSection
            title={copy.nextTrips}
            hint={copy.nextTripsHint}
            actionLabel={copy.viewAll}
            actionHref="/client/profile/bookings"
          >
            <div className="grid gap-3">
              {isUpcomingLoading ? (
                <>
                  <BookingCardSkeleton />
                  <BookingCardSkeleton />
                </>
              ) : upcomingTrips.length > 0 ? (
                upcomingTrips.map((experience) => (
                  <BookingPreviewCard
                    key={experience.id}
                    experience={experience}
                    actionLabel={copy.requestChanges}
                    returnTo="/client/profile"
                  />
                ))
              ) : (
                <p className="rounded-3xl bg-gray-50 px-4 py-8 text-center text-sm font-bold text-gray-500">
                  {copy.noTrips}
                </p>
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            title={copy.history}
            hint={copy.historyHint}
            actionLabel={copy.viewAll}
            actionHref="/client/profile/tours"
          >
            <div className="grid gap-3">
              {isPastLoading ? (
                <>
                  <BookingCardSkeleton />
                  <BookingCardSkeleton />
                </>
              ) : pastTrips.length > 0 ? (
                pastTrips.map((experience) => (
                  <BookingPreviewCard
                    key={experience.id}
                    experience={experience}
                    actionLabel={copy.completed}
                    returnTo="/client/profile"
                  />
                ))
              ) : (
                <p className="rounded-3xl bg-gray-50 px-4 py-8 text-center text-sm font-bold text-gray-500">
                  {copy.noHistory}
                </p>
              )}
            </div>
          </ProfileSection>
        </div>

        <aside className="grid h-fit gap-4">
          <ProfileSection title={copy.account}>
            <ProfileActionList
              actions={profileActions[language]}
              openLabel={copy.open}
            />
          </ProfileSection>

          <ProfileSection title={copy.support}>
            <ProfileActionList
              actions={supportActions[language]}
              openLabel={copy.open}
            />
          </ProfileSection>

          <ProfileSection title={copy.settings}>
            <ProfileSettingsPanel
              copy={copy}
              profile={profile}
              darkMode={profile?.darkMode}
              onProfileUpdated={setProfile}
            />
          </ProfileSection>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => {
              void logoutClient();
            }}
            className={`flex items-center justify-center gap-2 rounded-3xl border border-red-100 bg-white px-5 py-4 text-sm font-extrabold text-red-600 shadow-sm shadow-red-100/60 transition hover:bg-red-50 active:scale-[0.98] ${
              isLoggingOut ? "cursor-wait opacity-75 [color:transparent]" : ""
            }`}
          >
            <ArrowRightOnRectangleIcon
              className={`size-5 ${isLoggingOut ? "text-red-600" : ""}`}
            />
            {isLoggingOut ? (
              <LogoutLoadingLabel
                label={language === "es" ? "Cerrando sesion" : "Signing out"}
              />
            ) : null}
            {language === "es" ? "Cerrar sesión" : "Log out"}
          </button>
        </aside>
      </div>
      <style>
        {`
          @keyframes profile-page-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes profile-content-in {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </main>
  );
}

function LogoutLoadingLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-red-600">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-240ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-120ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-current" />
      </span>
    </span>
  );
}

function getBookingExperiences(bookings: unknown): Experience[] {
  if (!bookings) return [];
  return normalizeBookingExperiences(bookings);
}

function isRecentIsoDate(value: string | undefined, windowMs: number) {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  return Date.now() - time <= windowMs;
}
