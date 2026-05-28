import { useNavigate } from "react-router";

import {
  ProfileSimpleHeader,
  TourHistoryReviewCard,
} from "./profile/components";
import { getPastTours } from "./profile/bookings";
import { profileCopy } from "./profile/content";
import { useClientI18n } from "./i18n";

export default function ClientProfileToursHistory() {
  const navigate = useNavigate();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];

  return (
    <main className="min-h-screen bg-[#f8f8f6] pb-10 text-gray-950">
      <ProfileSimpleHeader
        title={copy.toursHistoryTitle}
        hint={copy.toursHistoryHint}
        backLabel={t("back")}
        onBack={() => navigate("/client/profile")}
      />
      <div className="mx-auto grid max-w-5xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {getPastTours().map((experience) => (
          <TourHistoryReviewCard
            key={experience.id}
            experience={experience}
            copy={copy}
            returnTo="/client/profile/tours"
          />
        ))}
      </div>
    </main>
  );
}
