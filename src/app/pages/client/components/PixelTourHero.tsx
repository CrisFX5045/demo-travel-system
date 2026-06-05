import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { PixelTourFeaturedTours } from "./PixelTourFeaturedTours";
import "../style/PixelTourHero.css";

const SPRITE_BASE_PATH = "/images/animation/sprites-animation-home";
const FROG_PROMO_MESSAGE = "promo";

export function PixelTourHero() {
  const { t } = useTranslation();
  const [frogBubbleKey, setFrogBubbleKey] = useState(0);
  const [frogBubbleMessage, setFrogBubbleMessage] =
    useState(FROG_PROMO_MESSAGE);
  const frogMessageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frogMessageTimerRef.current === null) return;

      window.clearTimeout(frogMessageTimerRef.current);
    };
  }, []);

  const handleFrogClick = () => {
    if (frogMessageTimerRef.current !== null) {
      window.clearTimeout(frogMessageTimerRef.current);
    }

    setFrogBubbleMessage("croak");
    setFrogBubbleKey((current) => current + 1);

    frogMessageTimerRef.current = window.setTimeout(() => {
      setFrogBubbleMessage(FROG_PROMO_MESSAGE);
      setFrogBubbleKey((current) => current + 1);
      frogMessageTimerRef.current = null;
    }, 1800);
  };

  return (
    <section className="pixel-tour-hero relative isolate aspect-[4.8/1] min-h-[56px] overflow-hidden rounded-xl sm:aspect-[5.6/1] sm:min-h-[56px] lg:aspect-[5.9/1] lg:min-h-[56px]">
      <img
        className="pixel-tour-hero__background absolute inset-0 h-full w-full rounded-[inherit] object-cover"
        src={`${SPRITE_BASE_PATH}/fondo-paisaje.png`}
        alt=""
        aria-hidden="true"
        draggable={false}
        fetchPriority="high"
      />

      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--lapa pointer-events-none absolute"
        aria-hidden="true"
      />
      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--pajaro pointer-events-none absolute"
        aria-hidden="true"
      />
      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--pajaro pixel-tour-hero__sprite--pajaro-trail-one pointer-events-none absolute"
        aria-hidden="true"
      />
      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--pajaro pixel-tour-hero__sprite--pajaro-trail-two pointer-events-none absolute"
        aria-hidden="true"
      />
      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--rana pointer-events-none absolute"
        aria-hidden="true"
      />
      <button
        type="button"
        className="pixel-tour-hero__frog-trigger absolute"
        onClick={handleFrogClick}
        aria-label={t("client.pixelTour.frog.aria")}
      >
        <span
          key={frogBubbleKey}
          className="pixel-tour-hero__frog-bubble"
          aria-hidden="true"
        >
          <span>{t(`client.pixelTour.frog.${frogBubbleMessage}`)}</span>
        </span>
      </button>
      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--letrero pointer-events-none absolute"
        aria-hidden="true"
      />

      <PixelTourFeaturedTours />
    </section>
  );
}

export default PixelTourHero;
