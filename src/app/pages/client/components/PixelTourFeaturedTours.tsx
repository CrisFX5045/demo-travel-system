import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";
import { experiences } from "@/app/data/tourism";

import { getExperiencePath } from "../routes";
import "../style/PixelTourFeaturedTours.css";

const FEATURED_TOUR_IDS = ["EXP-1042", "EXP-1188", "EXP-1420"];
const FEATURED_TOUR_META: Record<
  string,
  { deadline: string; slotLabel: string; tier: string }
> = {
  "EXP-1042": {
    deadline: "2026-06-08T18:00:00-06:00",
    slotLabel: "Ultimo cupo doble",
    tier: "Firma Tailux",
  },
  "EXP-1188": {
    deadline: "2026-06-07T16:30:00-06:00",
    slotLabel: "Ultimo atardecer VIP",
    tier: "Atardecer VIP",
  },
  "EXP-1420": {
    deadline: "2026-06-09T12:00:00-06:00",
    slotLabel: "Ultimo cupo privado",
    tier: "Acceso oculto",
  },
};

export function PixelTourFeaturedTours() {
  const featuredTours = useMemo(
    () =>
      FEATURED_TOUR_IDS.flatMap((id) => {
        const experience = experiences.find((item) => item.id === id);
        return experience ? [experience] : [];
      }),
    [],
  );
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [activeDesktopTourId, setActiveDesktopTourId] = useState<string | null>(
    null,
  );
  const [desktopPopoverPosition, setDesktopPopoverPosition] = useState({
    left: 0,
    top: 0,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const desktopCloseTimerRef = useRef<number | null>(null);
  const activeTour =
    featuredTours.find((tour) => tour.id === activeTourId) ?? null;
  const activeDesktopTour =
    featuredTours.find((tour) => tour.id === activeDesktopTourId) ?? null;
  const activeTourImages = activeTour
    ? activeTour.images?.length
      ? activeTour.images
      : [activeTour.image]
    : [];

  const cancelDesktopClose = () => {
    if (desktopCloseTimerRef.current === null) return;

    window.clearTimeout(desktopCloseTimerRef.current);
    desktopCloseTimerRef.current = null;
  };

  const scheduleDesktopClose = () => {
    cancelDesktopClose();
    desktopCloseTimerRef.current = window.setTimeout(() => {
      setActiveDesktopTourId(null);
      desktopCloseTimerRef.current = null;
    }, 180);
  };

  const openDesktopTour = (
    tourId: string,
    element: HTMLElement,
    mode: "toggle" | "open" = "open",
  ) => {
    const rect = element.getBoundingClientRect();

    cancelDesktopClose();
    setDesktopPopoverPosition({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 4,
    });
    setActiveDesktopTourId((current) =>
      mode === "toggle" && current === tourId ? null : tourId,
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (desktopCloseTimerRef.current === null) return;

      window.clearTimeout(desktopCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeTourId && !activeDesktopTourId) return;

    const closeWhenOutside = (event: PointerEvent) => {
      if ((event.target as Element).closest(".pixel-tour-featured__modal-card")) {
        return;
      }

      if (
        (event.target as Element).closest(".pixel-tour-featured__desktop") ||
        (event.target as Element).closest(".pixel-tour-featured__desktop-popover")
      ) {
        return;
      }

      if (activeTourId && 
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(event.target as Node)
      ) {
        setActiveTourId(null);
      }

      if (activeDesktopTourId) {
        setActiveDesktopTourId(null);
      }
    };

    document.addEventListener("pointerdown", closeWhenOutside);

    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [activeDesktopTourId, activeTourId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeTourId]);

  useEffect(() => {
    if (!activeTour || activeTourImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => {
        const next = current === activeTourImages.length - 1 ? 0 : current + 1;
        const gallery = galleryRef.current;

        if (gallery) {
          gallery.scrollTo({
            left: next * gallery.clientWidth,
            behavior: "smooth",
          });
        }

        return next;
      });
    }, 3200);

    return () => window.clearInterval(timer);
  }, [activeTour, activeTourImages.length]);

  const scrollGalleryTo = (index: number) => {
    const gallery = galleryRef.current;

    setActiveImageIndex(index);
    gallery?.scrollTo({
      left: index * gallery.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="pixel-tour-featured" aria-label="Tours exclusivos">
      <div className="pixel-tour-featured__scrim" aria-hidden="true" />

      <div className="pixel-tour-featured__desktop">
        {featuredTours.map((tour) => (
          <article
            key={tour.id}
            className="pixel-tour-featured__card"
            tabIndex={0}
            onMouseEnter={(event) =>
              openDesktopTour(tour.id, event.currentTarget)
            }
            onMouseLeave={scheduleDesktopClose}
            onFocus={(event) => openDesktopTour(tour.id, event.currentTarget)}
            onClick={(event) => openDesktopTour(tour.id, event.currentTarget)}
          >
            <span className="pixel-tour-featured__peek">
              <span>{getPeekLabel(tour)}</span>
            </span>
          </article>
        ))}
      </div>

      {isMounted && activeDesktopTour
        ? createPortal(
            <div
              className="pixel-tour-featured__desktop-popover"
              style={{
                left: desktopPopoverPosition.left,
                top: desktopPopoverPosition.top,
              }}
              onMouseEnter={cancelDesktopClose}
              onMouseLeave={scheduleDesktopClose}
            >
              <TourPromotionPanel tour={activeDesktopTour} now={now} />
            </div>,
            document.body,
          )
        : null}

      <div className="pixel-tour-featured__mobile" ref={mobilePanelRef}>
        <div className="pixel-tour-featured__chips">
          {featuredTours.map((tour) => (
            <button
              key={tour.id}
              type="button"
              onClick={() =>
                setActiveTourId((current) => (current === tour.id ? null : tour.id))
              }
              className={tour.id === activeTour?.id ? "is-active" : undefined}
            >
              {tour.promotion?.badge ?? "Tour"}
            </button>
          ))}
        </div>

        {isMounted && activeTour
          ? createPortal(
              <div
                className="pixel-tour-featured__modal"
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  className="pixel-tour-featured__modal-backdrop"
                  onClick={() => setActiveTourId(null)}
                  aria-label="Cerrar promocion"
                />
                <article className="pixel-tour-featured__modal-card">
                  <div className="pixel-tour-featured__modal-gallery">
                    <div
                      className="pixel-tour-featured__gallery-track"
                      ref={galleryRef}
                      onScroll={(event) => {
                        const width = event.currentTarget.clientWidth;
                        if (!width) return;

                        setActiveImageIndex(
                          Math.round(event.currentTarget.scrollLeft / width),
                        );
                      }}
                    >
                      {activeTourImages.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt=""
                          loading="lazy"
                        />
                      ))}
                    </div>
                    {activeTourImages.length > 1 ? (
                      <>
                        <div className="pixel-tour-featured__gallery-dots">
                          {activeTourImages.map((image, index) => (
                            <button
                              key={`${image}-${index}`}
                              type="button"
                              className={
                                index === activeImageIndex ? "is-active" : undefined
                              }
                              onClick={() => scrollGalleryTo(index)}
                              aria-label={`Ver imagen ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="pixel-tour-featured__modal-body">
                    <div className="pixel-tour-featured__badges">
                      <span>{activeTour.promotion?.badge ?? "Exclusivo"}</span>
                      <span>{getTourMeta(activeTour).slotLabel}</span>
                    </div>
                    <h3>{activeTour.title}</h3>
                    <p>
                      {activeTour.zone}, {activeTour.province}
                    </p>
                    <span>
                      {getCountdownLabel(getTourMeta(activeTour).deadline, now)}
                    </span>
                    {activeTour.promotion?.description ? (
                      <p className="pixel-tour-featured__modal-description">
                        {activeTour.promotion.description}
                      </p>
                    ) : null}
                    <div className="pixel-tour-featured__modal-facts">
                      <div>
                        <small>Duracion</small>
                        <strong>{activeTour.duration}</strong>
                      </div>
                      <div>
                        <small>Desde</small>
                        <strong>
                          {formatTourPrice(
                            activeTour.price,
                            activeTour.priceCurrency,
                          )}
                        </strong>
                      </div>
                      <div>
                        <small>Rating</small>
                        <strong>{activeTour.rating}</strong>
                      </div>
                      <div>
                        <small>Salida</small>
                        <strong>{activeTour.nextSlot}</strong>
                      </div>
                    </div>
                    <div className="pixel-tour-featured__modal-tags">
                      {activeTour.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pixel-tour-featured__modal-footer">
                    <button type="button" onClick={() => setActiveTourId(null)}>
                      Cerrar
                    </button>
                    <Link
                      to={getExperiencePath(activeTour.id)}
                      state={{ from: "/client" }}
                    >
                      Informacion
                    </Link>
                  </div>
                </article>
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}

function TourPromotionPanel({ tour, now }: { tour: Experience; now: number }) {
  const images = tour.images?.length ? tour.images : [tour.image];

  return (
    <article className="pixel-tour-featured__content pixel-tour-featured__content--desktop">
      <div className="pixel-tour-featured__desktop-gallery">
        <div className="pixel-tour-featured__desktop-gallery-track">
          {images.slice(0, 4).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" loading="lazy" />
          ))}
        </div>
      </div>
      <div className="pixel-tour-featured__copy pixel-tour-featured__copy--desktop">
        <div className="pixel-tour-featured__badges">
          <span>{tour.promotion?.badge ?? "Exclusivo"}</span>
          <span>{getTourMeta(tour).slotLabel}</span>
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
          <span>{tour.rating} rating</span>
          <span>{tour.nextSlot}</span>
        </div>
      </div>
      <div className="pixel-tour-featured__footer">
        <div>
          <span>{formatTourPrice(tour.price, tour.priceCurrency)}</span>
          <small>{getCountdownLabel(getTourMeta(tour).deadline, now)}</small>
        </div>
        <Link to={getExperiencePath(tour.id)} state={{ from: "/client" }}>
          Informacion
        </Link>
      </div>
    </article>
  );
}

function getTourMeta(tour: Experience) {
  return FEATURED_TOUR_META[tour.id];
}

function getPeekLabel(tour: Experience) {
  const badge = tour.promotion?.badge;
  const title = tour.promotion?.title;

  if (badge && title) return `${badge} - ${title}`;
  return badge ?? title ?? "Oferta exclusiva";
}

function formatTourPrice(price: number, currency: "USD" | "CRC") {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function getCountdownLabel(deadline: string, now: number) {
  const diff = Math.max(0, new Date(deadline).getTime() - now);
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h para liberar cupo`;
  if (hours > 0) return `${hours}h ${minutes}m para liberar cupo`;
  return `${minutes}m para liberar cupo`;
}
