import type { RefObject } from "react";
import type { TFunction } from "i18next";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import { getExperiencePath } from "../../routes";
import {
  formatTourPrice,
  getCountdownLabel,
  getSlotLabel,
  getTourMeta,
} from "./utils";

type MobileFeaturedTourModalProps = {
  tour: Experience;
  images: string[];
  activeImageIndex: number;
  galleryRef: RefObject<HTMLDivElement | null>;
  now: number;
  t: TFunction;
  onClose: () => void;
  onImageIndexChange: (index: number) => void;
  onScrollGalleryTo: (index: number) => void;
};

export function MobileFeaturedTourModal({
  tour,
  images,
  activeImageIndex,
  galleryRef,
  now,
  t,
  onClose,
  onImageIndexChange,
  onScrollGalleryTo,
}: MobileFeaturedTourModalProps) {
  return (
    <div className="pixel-tour-featured__modal" role="dialog" aria-modal="true">
      <button
        type="button"
        className="pixel-tour-featured__modal-backdrop"
        onClick={onClose}
        aria-label={t("client.pixelTour.featured.closePromotion")}
      />
      <article className="pixel-tour-featured__modal-card">
        <div className="pixel-tour-featured__modal-gallery">
          <div
            className="pixel-tour-featured__gallery-track"
            ref={galleryRef}
            onScroll={(event) => {
              const width = event.currentTarget.clientWidth;
              if (!width) return;

              onImageIndexChange(
                Math.round(event.currentTarget.scrollLeft / width),
              );
            }}
          >
            {images.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" loading="lazy" />
            ))}
          </div>
          {images.length > 1 ? (
            <div className="pixel-tour-featured__gallery-dots">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={index === activeImageIndex ? "is-active" : undefined}
                  onClick={() => onScrollGalleryTo(index)}
                  aria-label={t("client.pixelTour.featured.imageLabel", {
                    number: index + 1,
                  })}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="pixel-tour-featured__modal-body">
          <div className="pixel-tour-featured__badges">
            <span>
              {tour.promotion?.badge ??
                t("client.pixelTour.featured.exclusive")}
            </span>
            <span>{getSlotLabel(tour, t)}</span>
          </div>
          <h3>{tour.title}</h3>
          <p>
            {tour.zone}, {tour.province}
          </p>
          <span>
            {getCountdownLabel(getTourMeta(tour).deadline, now, t)}
          </span>
          {tour.promotion?.description ? (
            <p className="pixel-tour-featured__modal-description">
              {tour.promotion.description}
            </p>
          ) : null}
          <div className="pixel-tour-featured__modal-facts">
            <div>
              <small>{t("client.pixelTour.featured.facts.duration")}</small>
              <strong>{tour.duration}</strong>
            </div>
            <div>
              <small>{t("client.pixelTour.featured.facts.from")}</small>
              <strong>{formatTourPrice(tour.price, tour.priceCurrency)}</strong>
            </div>
            <div>
              <small>{t("client.pixelTour.featured.facts.rating")}</small>
              <strong>{tour.rating}</strong>
            </div>
            <div>
              <small>{t("client.pixelTour.featured.facts.departure")}</small>
              <strong>{tour.nextSlot}</strong>
            </div>
          </div>
          <div className="pixel-tour-featured__modal-tags">
            {tour.tags.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="pixel-tour-featured__modal-footer">
          <button type="button" onClick={onClose}>
            {t("client.pixelTour.featured.close")}
          </button>
          <Link to={getExperiencePath(tour.id)} state={{ from: "/client" }}>
            {t("client.pixelTour.featured.info")}
          </Link>
        </div>
      </article>
    </div>
  );
}
