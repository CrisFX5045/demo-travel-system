import { CalendarDaysIcon, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import { formatExperiencePrice } from "../../price";

export function BookingPreviewCard({
  experience,
  actionLabel,
  returnTo,
}: {
  experience: Experience;
  actionLabel: string;
  returnTo: string;
}) {
  return (
    <Link
      to={`/client/profile/bookings/${experience.id}`}
      state={{ from: returnTo }}
      className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3 rounded-3xl bg-gray-50 p-2 transition active:scale-[0.99] md:grid-cols-[7rem_minmax(0,1fr)]"
    >
      <img
        src={experience.image}
        alt=""
        className="h-24 w-full rounded-2xl object-cover md:h-28"
      />
      <div className="min-w-0 py-1 pr-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">
              {experience.title}
            </p>
            <p className="mt-1 flex items-center gap-1 truncate text-xs font-bold text-gray-500">
              <MapPinIcon className="size-4 shrink-0" />
              {experience.zone}, {experience.province}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[0.68rem] font-extrabold">
            {actionLabel}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDaysIcon className="size-4" />
            {experience.nextSlot}
          </span>
          <span className="inline-flex items-center gap-1">
            <StarIcon className="size-4 fill-gray-950 text-gray-950" />
            {experience.rating}
          </span>
        </div>
        <p className="mt-2 truncate text-sm font-extrabold">
          {formatExperiencePrice(experience)}
        </p>
      </div>
    </Link>
  );
}
