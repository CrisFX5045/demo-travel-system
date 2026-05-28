import { StarIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import { formatExperiencePriceLine } from "../../price";
import { getExperiencePath } from "../../routes";

export function SuggestionRow({
  experience,
  language,
}: {
  experience: Experience;
  language: "es" | "en";
}) {
  return (
    <Link
      to={getExperiencePath(experience.id)}
      state={{ from: "/client/search" }}
      className="grid w-full min-w-0 max-w-full grid-cols-[5rem_minmax(0,1fr)] gap-3 overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-sm shadow-gray-200/60 transition active:scale-[0.99]"
    >
      <img
        src={experience.image}
        alt=""
        className="size-20 rounded-2xl object-cover"
      />
      <div className="min-w-0 py-1 pr-2">
        <h3 className="truncate text-base font-extrabold">
          {experience.title}
        </h3>
        <p className="mt-1 truncate text-sm font-bold text-gray-500">
          {experience.zone}, {experience.province}
        </p>
        <p className="mt-1 flex min-w-0 items-center gap-1 text-sm font-bold">
          <StarIcon className="size-4 shrink-0 fill-gray-950" />
          <span className="shrink-0">{experience.rating}</span>
          <span className="mx-1 text-gray-300">·</span>
          <span className="truncate text-gray-500">
            {formatExperiencePriceLine(experience, language)}
          </span>
        </p>
      </div>
    </Link>
  );
}
