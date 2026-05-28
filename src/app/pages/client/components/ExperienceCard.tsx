import { StarIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";
import { useClientI18n } from "../i18n";
import { formatExperiencePriceLine } from "../price";
import { getExperiencePath } from "../routes";
import { LikeToggleButton } from "./LikeToggleButton";
import { TransportPickupBadge } from "./TransportPickupBadge";

export function ExperienceCard({
  experience,
  isLiked,
  onToggleLiked,
  variant = "rail",
  returnTo = "/client",
}: {
  experience: Experience;
  isLiked: boolean;
  onToggleLiked: () => void;
  variant?: "rail" | "grid";
  returnTo?: string;
}) {
  const { language } = useClientI18n();

  return (
    <article
      className={
        variant === "grid"
          ? "min-w-0"
          : "w-[40vw] md:w-[30vw] max-w-[16rem] shrink-0 md:w-auto md:max-w-none"
      }
    >
      <div className="relative rounded-[1.15rem] bg-gray-100 md:rounded-[1.35rem]">
        <Link
          to={getExperiencePath(experience.id)}
          state={{ from: returnTo }}
          className="block overflow-hidden rounded-[1.15rem] md:rounded-[1.35rem]"
        >
          <img
            src={experience.image}
            alt=""
            className="aspect-[1.04] w-full object-cover"
          />
          {experience.promoted && (
            <div className="absolute left-2.5 top-2.5 rounded-lg bg-red-600 px-2 py-1 text-[0.68rem] font-extrabold text-white md:left-3 md:top-3 md:text-xs">
              {language === "es" ? "Ahorros exclusivos" : "Exclusive savings"}
            </div>
          )}
        </Link>
        <LikeToggleButton
          isLiked={isLiked}
          onToggleLiked={onToggleLiked}
          className="absolute right-2.5 top-2.5 bg-white/90 text-gray-950 md:right-3 md:top-3 md:size-10"
          iconClassName="md:size-7"
        />
        <TransportPickupBadge
          pickupStops={experience.transport?.pickupStops}
          className="bottom-2.5 right-2.5 md:bottom-3 md:right-3"
        />
      </div>
      <div className="mt-2.5 md:mt-3">
        <Link
          to={getExperiencePath(experience.id)}
          state={{ from: returnTo }}
          className="block truncate text-base font-extrabold text-gray-950 md:text-xl"
        >
          {experience.title}
        </Link>
        <p className="mt-0.5 truncate text-sm font-bold text-gray-700 md:text-base">
          {experience.zone}, {experience.province}
        </p>
        <p className="mt-0.5 truncate text-sm text-gray-500 md:text-base">
          {formatExperiencePriceLine(experience, language)}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-gray-950 md:text-base">
          <StarIcon className="size-3.5 fill-gray-950 md:size-4" />
          {experience.rating}
        </p>
      </div>
    </article>
  );
}
