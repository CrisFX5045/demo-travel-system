import type { TFunction } from "i18next";

import type { Experience } from "@/app/data/tourism";

type MobileFeaturedTourChipsProps = {
  tours: Experience[];
  activeTourId: string | null;
  onToggleTour: (tourId: string) => void;
  t: TFunction;
};

export function MobileFeaturedTourChips({
  tours,
  activeTourId,
  onToggleTour,
  t,
}: MobileFeaturedTourChipsProps) {
  return (
    <div className="pixel-tour-featured__chips">
      {tours.map((tour) => (
        <button
          key={tour.id}
          type="button"
          onClick={() => onToggleTour(tour.id)}
          className={tour.id === activeTourId ? "is-active" : undefined}
        >
          {tour.promotion?.badge ?? t("client.pixelTour.featured.tour")}
        </button>
      ))}
    </div>
  );
}
