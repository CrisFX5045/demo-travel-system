import { StarIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { PopularTour } from "../content";
import { useClientI18n } from "../i18n";
import { getExperiencePath } from "../routes";
import { LikeToggleButton } from "./LikeToggleButton";

export function TourCard({
  tour,
  isLiked,
  onToggleLiked,
}: {
  tour: PopularTour;
  isLiked: boolean;
  onToggleLiked: () => void;
}) {
  const { t, language } = useClientI18n();

  return (
    <article className="w-[40vw] md:w-[30vw] max-w-[16rem] shrink-0 md:w-auto md:max-w-none">
      <Link
        to={getExperiencePath(tour.id)}
        state={{ from: "/client" }}
        className="relative block overflow-hidden rounded-[1.15rem] bg-gray-100 md:rounded-[1.35rem]"
      >
        <img
          src={tour.image}
          alt=""
          className="aspect-[1.04] w-full object-cover"
        />
        <div className="absolute left-2.5 top-2.5 max-w-[72%] rounded-2xl bg-white/90 px-2.5 py-1.5 text-xs font-extrabold leading-tight shadow-sm md:left-3 md:top-3 md:px-3 md:py-2 md:text-sm">
          {t("favoriteAmongTravelers")}
        </div>
        <LikeToggleButton
          isLiked={isLiked}
          onToggleLiked={onToggleLiked}
          className="absolute right-2.5 top-2.5 bg-black/25 text-white backdrop-blur md:right-3 md:top-3 md:size-10"
          iconClassName={`md:size-7 ${isLiked ? "text-rose-500" : ""}`}
        />
      </Link>
      <Link
        to={getExperiencePath(tour.id)}
        state={{ from: "/client" }}
        className="mt-2.5 block truncate text-base font-extrabold md:mt-3 md:text-xl"
      >
        {tour.title}
      </Link>
      <p className="truncate text-sm font-bold text-gray-700 md:text-base">
        {tour.location}
      </p>
      <p className="truncate text-sm text-gray-500 md:text-base">
        {language === "es"
          ? tour.price
          : tour.price.replace("Desde", "From").replace("por persona", "per person")}
      </p>
      <p className="flex items-center gap-1 text-sm font-semibold md:text-base">
        <StarIcon className="size-3.5 fill-gray-950 md:size-4" />
        {tour.rating}
      </p>
    </article>
  );
}
