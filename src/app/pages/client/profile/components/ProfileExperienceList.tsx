import { StarIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import { formatExperiencePrice } from "../../price";

export function ProfileExperienceList({
  experiences,
  returnTo,
  mode,
  actionLabel,
}: {
  experiences: Experience[];
  returnTo: string;
  mode: "booking" | "experience";
  actionLabel: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience) => {
        const href =
          mode === "booking"
            ? `/client/profile/bookings/${experience.id}`
            : `/client/experiences/${experience.id}`;

        return (
          <Link
            key={experience.id}
            to={href}
            state={{ from: returnTo }}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60 transition active:scale-[0.99]"
          >
            <img
              src={experience.image}
              alt=""
              className="aspect-[1.2] w-full object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-lg font-extrabold">
                  {experience.title}
                </h2>
                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[0.68rem] font-extrabold">
                  {actionLabel}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-bold text-gray-500">
                {experience.zone}, {experience.province}
              </p>
              <div className="mt-3 flex min-w-0 items-center gap-2 text-sm font-bold">
                <StarIcon className="size-4 shrink-0 fill-gray-950" />
                <span>{experience.rating}</span>
                <span className="text-gray-300">·</span>
                <span className="truncate text-gray-500">
                  {formatExperiencePrice(experience)}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
