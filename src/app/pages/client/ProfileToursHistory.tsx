import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useApiResource } from "@/app/api/hooks";
import { normalizeBookingExperiences } from "@/app/api/normalizers";
import { hasClientAccessToken } from "@/app/api/session";
import { travelerApi } from "@/app/api/services";
import { BookingCardSkeleton } from "./components";
import {
  ProfileSimpleHeader,
  TourHistoryReviewCard,
} from "./profile/components";
import { profileCopy } from "./profile/content";
import { useClientI18n } from "./i18n";

export default function ClientProfileToursHistory() {
  const navigate = useNavigate();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];
  const isAuthenticated = useMemo(() => hasClientAccessToken(), []);
  const {
    data: bookings,
    isLoading,
    error,
  } = useApiResource(() => travelerApi.getBookings("past"), [], {
    enabled: isAuthenticated,
    requestKey: "client-bookings-past",
  });
  const apiExperiences = normalizeBookingExperiences(bookings);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/client/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-[#f8f8f6] pb-10 text-gray-950">
      <ProfileSimpleHeader
        title={copy.toursHistoryTitle}
        hint={copy.toursHistoryHint}
        backLabel={t("back")}
        onBack={() => navigate("/client/profile")}
      />
      <div className="mx-auto grid max-w-5xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {isLoading ? (
          <>
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </>
        ) : error || apiExperiences.length === 0 ? (
          <p className="rounded-3xl bg-white px-4 py-10 text-center text-sm font-bold text-gray-500 shadow-sm shadow-gray-200/50 sm:col-span-2 lg:col-span-3">
            {copy.noHistory}
          </p>
        ) : (
          apiExperiences.map((experience) => (
            <TourHistoryReviewCard
              key={experience.id}
              experience={experience}
              copy={copy}
              returnTo="/client/profile/tours"
            />
          ))
        )}
      </div>
    </main>
  );
}
