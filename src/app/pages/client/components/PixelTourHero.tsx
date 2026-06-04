import { PixelTourFeaturedTours } from "./PixelTourFeaturedTours";
import "./PixelTourHero.css";

const SPRITE_BASE_PATH = "/images/animation/sprites-animation-home";

export function PixelTourHero() {
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
      <span
        className="pixel-tour-hero__sprite pixel-tour-hero__sprite--letrero pointer-events-none absolute"
        aria-hidden="true"
      />

      <PixelTourFeaturedTours />
    </section>
  );
}

export default PixelTourHero;
