import type { TFunction } from "i18next";

import type { Experience } from "@/app/data/tourism";

import { getPeekLabel } from "./utils";

type DesktopFeaturedTourButtonsProps = {
  tours: Experience[];
  activeTourId: string | null;
  onOpenTour: (tourId: string, element: HTMLElement) => void;
  onScheduleClose: () => void;
  t: TFunction;
};

export function DesktopFeaturedTourButtons({
  tours,
  activeTourId,
  onOpenTour,
  onScheduleClose,
  t,
}: DesktopFeaturedTourButtonsProps) {
  return (
    <div className="pixel-tour-featured__desktop">
      {tours.map((tour) => (
        <article
          key={tour.id}
          className={`pixel-tour-featured__card ${
            tour.id === activeTourId ? "is-active" : ""
          }`}
          tabIndex={0}
          onMouseEnter={(event) => onOpenTour(tour.id, event.currentTarget)}
          onMouseLeave={onScheduleClose}
          onFocus={(event) => onOpenTour(tour.id, event.currentTarget)}
          onClick={(event) => onOpenTour(tour.id, event.currentTarget)}
        >
          <span className="pixel-tour-featured__peek">
            <span>{getPeekLabel(tour, t)}</span>
          </span>
        </article>
      ))}
    </div>
  );
}
