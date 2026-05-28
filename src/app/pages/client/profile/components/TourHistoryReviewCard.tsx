import {
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import type { ProfileCopy } from "../content";

export function TourHistoryReviewCard({
  experience,
  copy,
  returnTo,
}: {
  experience: Experience;
  copy: ProfileCopy;
  returnTo: string;
}) {
  return (
    <Link
      to={`/client/profile/bookings/${experience.id}`}
      state={{ from: returnTo }}
      className="block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60 transition active:scale-[0.99]"
    >
      <article>
        <img
          src={experience.image}
          alt=""
          className="aspect-[1.22] w-full object-cover"
        />

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="line-clamp-2 text-lg font-extrabold">
                {experience.title}
              </span>
              <p className="mt-2 flex items-center gap-1 truncate text-sm font-bold text-gray-500">
                <MapPinIcon className="size-4 shrink-0" />
                {experience.zone}, {experience.province}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-extrabold text-emerald-700">
              {copy.completed}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm font-bold text-gray-500">
            <CalendarDaysIcon className="size-4 shrink-0" />
            <span className="text-gray-700">{copy.tourDate}:</span>
            <span className="truncate">{experience.nextSlot}</span>
          </div>

          <span className="mt-4 block rounded-full bg-gray-950 px-4 py-3 text-center text-sm font-extrabold text-white">
            {copy.ViewDetails}
          </span>
        </div>
      </article>
    </Link>
  );
}
