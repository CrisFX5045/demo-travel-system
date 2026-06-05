import type { TFunction } from "i18next";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import { getExperiencePath } from "../../routes";
import {
  formatTourPrice,
  getCountdownLabel,
  getSlotLabel,
  getTourImages,
  getTourMeta,
} from "./utils";

type TourPromotionPanelProps = {
  tour: Experience;
  now: number;
  t: TFunction;
};

export function TourPromotionPanel({ tour, now, t }: TourPromotionPanelProps) {
  const desktopImages = getTourImages(tour).slice(0, 4);
  const desktopSlideCount = desktopImages.length;
  const [activeDesktopImageIndex, setActiveDesktopImageIndex] = useState(0);

  useEffect(() => {
    setActiveDesktopImageIndex(0);
  }, [tour.id]);

  useEffect(() => {
    if (desktopSlideCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveDesktopImageIndex((current) =>
        current === desktopSlideCount - 1 ? 0 : current + 1,
      );
    }, 3200);

    return () => window.clearInterval(timer);
  }, [desktopSlideCount, tour.id]);

  const showPreviousDesktopImage = () => {
    setActiveDesktopImageIndex((current) =>
      current === 0 ? desktopSlideCount - 1 : current - 1,
    );
  };

  const showNextDesktopImage = () => {
    setActiveDesktopImageIndex((current) =>
      current === desktopSlideCount - 1 ? 0 : current + 1,
    );
  };

  return (
    <article className="pixel-tour-featured__content pixel-tour-featured__content--desktop">
      <div
        className={`pixel-tour-featured__desktop-gallery pixel-tour-featured__desktop-gallery--${desktopSlideCount}`}
      >
        <div
          className="pixel-tour-featured__desktop-gallery-track"
          style={{
            transform: `translateX(-${activeDesktopImageIndex * 100}%)`,
          }}
        >
          {desktopImages.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" loading="lazy" />
          ))}
        </div>
        {desktopSlideCount > 1 ? (
          <>
            <div className="pixel-tour-featured__desktop-gallery-controls">
              <button
                type="button"
                onClick={showPreviousDesktopImage}
                aria-label={t("client.pixelTour.featured.previousImage")}
              >
                <ChevronLeftIcon className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={showNextDesktopImage}
                aria-label={t("client.pixelTour.featured.nextImage")}
              >
                <ChevronRightIcon className="size-3.5" />
              </button>
            </div>
            <div className="pixel-tour-featured__desktop-gallery-dots">
              {desktopImages.map((image, index) => (
                <span
                  key={`${image}-${index}`}
                  className={
                    index === activeDesktopImageIndex ? "is-active" : undefined
                  }
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div className="pixel-tour-featured__copy pixel-tour-featured__copy--desktop">
        <div className="pixel-tour-featured__badges">
          <span>
            {tour.promotion?.badge ??
              t("client.pixelTour.featured.exclusive")}
          </span>
          <span>{getSlotLabel(tour, t)}</span>
        </div>
        <h3>{tour.title}</h3>
        <p className="pixel-tour-featured__meta">
          {tour.zone}, {tour.province}
        </p>
        {tour.promotion?.description ? (
          <p className="pixel-tour-featured__desktop-description">
            {tour.promotion.description}
          </p>
        ) : null}
        <div className="pixel-tour-featured__desktop-facts">
          <span>{tour.duration}</span>
          <span>
            {t("client.pixelTour.featured.ratingValue", {
              rating: tour.rating,
            })}
          </span>
          <span>{tour.nextSlot}</span>
        </div>
      </div>
      <div className="pixel-tour-featured__footer">
        <div>
          <span>{formatTourPrice(tour.price, tour.priceCurrency)}</span>
          <small>
            {getCountdownLabel(getTourMeta(tour).deadline, now, t)}
          </small>
        </div>
        <Link to={getExperiencePath(tour.id)} state={{ from: "/client" }}>
          {t("client.pixelTour.featured.info")}
        </Link>
      </div>
    </article>
  );
}
