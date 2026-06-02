import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useApiResource } from "@/app/api/hooks";
import { normalizeBookingExperiences } from "@/app/api/normalizers";
import { hasClientAccessToken } from "@/app/api/session";
import { travelerApi } from "@/app/api/services";
import { BookingCardSkeleton } from "./components";
import {
  ProfileExperienceList,
  ProfileSimpleHeader,
} from "./profile/components";
import { profileCopy } from "./profile/content";
import { useClientI18n } from "./i18n";

export default function ClientProfileBookings() {
  const navigate = useNavigate();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];
  const isAuthenticated = useMemo(() => hasClientAccessToken(), []);
  const {
    data: bookings,
    isLoading,
    error,
  } = useApiResource(() => travelerApi.getBookings("upcoming"), [], {
    enabled: isAuthenticated,
    requestKey: "client-bookings-upcoming",
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
        title={copy.nextTrips}
        hint={copy.nextTripsHint}
        backLabel={t("back")}
        onBack={() => navigate("/client/profile")}
      />
      <div className="mx-auto max-w-5xl px-4 py-5 md:px-8">
        {isLoading ? (
          <div className="grid gap-3">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : error || apiExperiences.length === 0 ? (
          <p className="rounded-3xl bg-white px-4 py-10 text-center text-sm font-bold text-gray-500 shadow-sm shadow-gray-200/50">
            {copy.noTrips}
          </p>
        ) : (
          <ProfileExperienceList
            experiences={apiExperiences}
            returnTo="/client/profile/bookings"
            mode="booking"
            actionLabel={copy.manage}
          />
        )}
      </div>
    </main>
  );
}
