import { useMemo } from "react";
import { useNavigate } from "react-router";

import { experiences } from "@/app/data/tourism";

import { useScrollChrome } from "./hooks/useScrollChrome";
import { useClientI18n } from "./i18n";
import {
  BookingPreviewCard,
  ProfileActionList,
  ProfileHeader,
  ProfileSection,
  ProfileStats,
  TravelerSummary,
} from "./profile/components";
import {
  profileActions,
  profileCopy,
  supportActions,
} from "./profile/content";

export default function ClientProfile() {
  const navigate = useNavigate();
  const { isMobileHeaderVisible } = useScrollChrome();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];
  const isIdentityVerified = true;
  const upcomingTrips = useMemo(
    () => experiences.filter((experience) =>
      ["EXP-1042", "EXP-1188"].includes(experience.id),
    ),
    [],
  );
  const pastTrips = useMemo(
    () => experiences.filter((experience) =>
      ["EXP-1217", "EXP-1475"].includes(experience.id),
    ),
    [],
  );

  return (
    <main className="min-h-screen bg-[#f8f8f6] pb-[calc(5rem+env(safe-area-inset-bottom))] text-gray-950">
      <ProfileHeader
        title={copy.title}
        eyebrow={copy.eyebrow}
        backLabel={t("back")}
        isVisible={isMobileHeaderVisible}
        onBack={() => navigate("/client")}
      />
      <div className="h-[5.05rem]" />

      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-5 md:grid-cols-[minmax(0,1fr)_20rem] md:px-8 md:py-6">
        <div className="grid gap-4">
          <TravelerSummary
            copy={copy}
            isIdentityVerified={isIdentityVerified}
          />
          <ProfileStats copy={copy} />

          <ProfileSection
            title={copy.nextTrips}
            hint={copy.nextTripsHint}
            actionLabel={copy.viewAll}
            actionHref="/client/profile/bookings"
          >
            <div className="grid gap-3">
              {upcomingTrips.length > 0 ? (
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
              {pastTrips.map((experience) => (
                <BookingPreviewCard
                  key={experience.id}
                  experience={experience}
                  actionLabel={copy.open}
                  returnTo="/client/profile"
                />
              ))}
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
        </aside>
      </div>
    </main>
  );
}
