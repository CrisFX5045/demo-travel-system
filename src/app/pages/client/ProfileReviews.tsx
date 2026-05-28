import { PencilSquareIcon, StarIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

import {
  ProfileSimpleHeader,
} from "./profile/components";
import { getPastTours } from "./profile/bookings";
import { profileCopy } from "./profile/content";
import { useClientI18n } from "./i18n";

export default function ClientProfileReviews() {
  const navigate = useNavigate();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];
  const tours = getPastTours();

  return (
    <main className="min-h-screen bg-[#f8f8f6] pb-10 text-gray-950">
      <ProfileSimpleHeader
        title={copy.reviewsTitle}
        hint={copy.reviewsHint}
        backLabel={t("back")}
        onBack={() => navigate("/client/profile")}
      />
      <div className="mx-auto grid max-w-5xl gap-3 px-4 py-5 md:px-8">
        {tours.map((experience) => (
          <article
            key={experience.id}
            className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-3xl border border-gray-100 bg-white p-2 shadow-sm shadow-gray-200/60"
          >
            <img
              src={experience.image}
              alt=""
              className="size-20 rounded-2xl object-cover"
            />
            <div className="min-w-0 py-1 pr-2">
              <h2 className="truncate text-base font-extrabold">
                {experience.title}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm font-bold text-gray-500">
                <StarIcon className="size-4 fill-gray-950 text-gray-950" />
                {experience.rating} · {experience.reviews}+
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-xs font-extrabold text-white transition active:scale-[0.98]"
              >
                <PencilSquareIcon className="size-4" />
                {copy.ViewDetails}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
