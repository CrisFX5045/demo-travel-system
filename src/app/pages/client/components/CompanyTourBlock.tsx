import {
  ArrowRightIcon,
  CheckBadgeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import type { CompanyGroup } from "../company";
import { getCompanyPath } from "../company";
import { useClientI18n } from "../i18n";
import { formatExperiencePriceLine } from "../price";
import { getExperiencePath } from "../routes";
import { LikeToggleButton } from "./LikeToggleButton";
import { TransportPickupBadge } from "./TransportPickupBadge";

export function CompanyTourBlock({
  group,
  liked,
  onToggleLiked,
  showCompanyHeader = true,
  layout = "rail",
  returnTo,
}: {
  group: CompanyGroup;
  liked: Record<string, boolean>;
  onToggleLiked: (experienceId: string) => void;
  showCompanyHeader?: boolean;
  layout?: "rail" | "two-columns";
  returnTo?: string;
}) {
  const experienceReturnPath = returnTo ?? getCompanyPath(group.company);
  const { t } = useClientI18n();

  return (
    <section className="w-full max-w-full min-w-0 py-5">
      {showCompanyHeader && (
        <div className="mb-3 flex items-center justify-between gap-4">
          <Link
            to={getCompanyPath(group.company)}
            className="min-w-0 flex-1 cursor-pointer transition hover:text-green-700"
          >
            <p className="text-xs font-bold uppercase text-gray-500">
              {t("verifiedTourCompany")}
            </p>
            <h2 className="flex min-w-0 items-center gap-1.5 text-xl font-extrabold">
              <span className="truncate">{group.company}</span>
              <CheckBadgeIcon className="size-5 shrink-0 text-sky-600" />
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm font-bold text-gray-500">
              <StarIcon className="size-4 fill-gray-500" />
              {group.rating} - {group.zone}, {group.province}
            </p>
          </Link>
          <Link
            to={getCompanyPath(group.company)}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-gray-100 transition hover:bg-gray-200 active:scale-95"
            aria-label={`${t("viewCompanyTours")} ${group.company}`}
          >
            <ArrowRightIcon className="size-5" />
          </Link>
        </div>
      )}

      <div
        className={
          layout === "two-columns"
            ? "grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fill,minmax(10.5rem,12rem))] md:justify-start md:gap-5 xl:grid-cols-[repeat(auto-fill,minmax(11rem,12.5rem))]"
            : "flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] md:grid md:grid-cols-[repeat(auto-fill,minmax(10.5rem,12rem))] md:justify-start md:gap-5 md:overflow-visible xl:grid-cols-[repeat(auto-fill,minmax(11rem,12.5rem))] [&::-webkit-scrollbar]:hidden"
        }
      >
        {group.experiences.map((experience) => (
          <CompanyExperienceCard
            key={experience.id}
            experience={experience}
            isLiked={Boolean(liked[experience.id])}
            onToggleLiked={() => onToggleLiked(experience.id)}
            isCompact={layout === "two-columns"}
            returnTo={experienceReturnPath}
          />
        ))}
      </div>
    </section>
  );
}

function CompanyExperienceCard({
  experience,
  isLiked,
  onToggleLiked,
  isCompact = false,
  returnTo,
}: {
  experience: Experience;
  isLiked: boolean;
  onToggleLiked: () => void;
  isCompact?: boolean;
  returnTo: string;
}) {
  const { language } = useClientI18n();

  return (
    <article
      className={
        isCompact
          ? "min-w-0"
          : "w-[40vw] md:w-[30vw] max-w-[16rem] shrink-0 md:w-auto md:max-w-none"
      }
    >
      <div className="relative rounded-2xl bg-gray-100 transition duration-200 md:hover:shadow-lg md:hover:shadow-gray-950/10">
        <Link
          to={getExperiencePath(experience.id)}
          state={{ from: returnTo }}
          className="group block cursor-pointer overflow-hidden rounded-2xl"
        >
          <img
            src={experience.image}
            alt=""
            className="aspect-[1.04] w-full object-cover transition duration-500 md:group-hover:scale-105"
          />
        </Link>
        <LikeToggleButton
          isLiked={isLiked}
          onToggleLiked={onToggleLiked}
          className="absolute right-2.5 top-2.5 bg-white/90 text-gray-950 md:right-3 md:top-3 md:size-9"
          iconClassName="md:size-6"
        />
        <TransportPickupBadge
          pickupStops={experience.transport?.pickupStops}
          className="bottom-2.5 right-2.5"
        />
      </div>
      <Link
        to={getExperiencePath(experience.id)}
        state={{ from: returnTo }}
        className="mt-2 block cursor-pointer truncate text-base font-extrabold transition hover:text-green-700 md:text-lg"
      >
        {experience.title}
      </Link>
      <p className="truncate text-sm font-bold text-gray-700">
        {experience.zone}, {experience.province}
      </p>
      <p className="truncate text-sm text-gray-500">
        {formatExperiencePriceLine(experience, language)}
      </p>
      <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-gray-950">
        <StarIcon className="size-3.5 fill-gray-950" />
        {experience.rating}
      </p>
    </article>
  );
}
