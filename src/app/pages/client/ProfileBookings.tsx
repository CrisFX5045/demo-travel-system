import { useNavigate } from "react-router";

import {
  ProfileExperienceList,
  ProfileSimpleHeader,
} from "./profile/components";
import { getUpcomingBookings } from "./profile/bookings";
import { profileCopy } from "./profile/content";
import { useClientI18n } from "./i18n";

export default function ClientProfileBookings() {
  const navigate = useNavigate();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];

  return (
    <main className="min-h-screen bg-[#f8f8f6] pb-10 text-gray-950">
      <ProfileSimpleHeader
        title={copy.nextTrips}
        hint={copy.nextTripsHint}
        backLabel={t("back")}
        onBack={() => navigate("/client/profile")}
      />
      <div className="mx-auto max-w-5xl px-4 py-5 md:px-8">
        <ProfileExperienceList
          experiences={getUpcomingBookings()}
          returnTo="/client/profile/bookings"
          mode="booking"
          actionLabel={copy.manage}
        />
      </div>
    </main>
  );
}
