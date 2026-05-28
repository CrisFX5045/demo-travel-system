import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBusAlt } from "react-icons/fa";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../../i18n";
import { formatExperiencePrice } from "../../price";

export function FeedExperienceInfo({
  experience,
}: {
  experience: Experience;
}) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isTransportMounted, setIsTransportMounted] = useState(false);
  const [isTransportVisible, setIsTransportVisible] = useState(false);
  const transportContainerRef = useRef<HTMLDivElement>(null);
  const transportFrameRef = useRef<number | null>(null);
  const transportTimerRef = useRef<number | null>(null);
  const { t, language, text } = useClientI18n();
  const pickupStops = experience.transport?.pickupStops;
  const description =
    language === "es"
      ? `${experience.company} te lleva a ${experience.zone}, ${experience.province}. Duracion ${experience.duration}, dificultad ${experience.difficulty.toLowerCase()}. Incluye ${experience.tags.join(", ")}. Proximo cupo: ${experience.nextSlot}.`
      : `${experience.company} takes you to ${experience.zone}, ${experience.province}. Duration ${experience.duration}, ${experience.difficulty.toLowerCase()} difficulty. Includes ${experience.tags.join(", ")}. Next slot: ${experience.nextSlot}.`;

  const clearTransportAnimation = useCallback(() => {
    if (transportFrameRef.current !== null) {
      cancelAnimationFrame(transportFrameRef.current);
      transportFrameRef.current = null;
    }

    if (transportTimerRef.current !== null) {
      window.clearTimeout(transportTimerRef.current);
      transportTimerRef.current = null;
    }
  }, []);

  const openTransport = useCallback(() => {
    clearTransportAnimation();
    setIsTransportMounted(true);
    setIsTransportVisible(false);

    transportFrameRef.current = requestAnimationFrame(() => {
      setIsTransportVisible(true);
      transportFrameRef.current = null;
    });
  }, [clearTransportAnimation]);

  const closeTransport = useCallback(() => {
    clearTransportAnimation();
    setIsTransportVisible(false);

    transportTimerRef.current = window.setTimeout(() => {
      setIsTransportMounted(false);
      transportTimerRef.current = null;
    }, 200);
  }, [clearTransportAnimation]);

  const toggleTransport = useCallback(() => {
    if (isTransportMounted) {
      closeTransport();
    } else {
      openTransport();
    }
  }, [closeTransport, isTransportMounted, openTransport]);

  useEffect(() => clearTransportAnimation, [clearTransportAnimation]);

  useEffect(() => {
    if (!isTransportMounted) return;

    const closeOnOutsideClick = (event: globalThis.PointerEvent) => {
      if (!transportContainerRef.current?.contains(event.target as Node)) {
        closeTransport();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [closeTransport, isTransportMounted]);

  return (
    <div className="max-w-[calc(100%-4.5rem)] lg:max-w-full">
      <div ref={transportContainerRef} className="relative flex flex-wrap gap-2">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold">
          #{text(experience.category)}
        </span>
        {experience.promoted && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold">
            {experience.promotion?.badge ?? "Promo"}
          </span>
        )}
        {pickupStops?.length ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleTransport();
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold transition active:scale-95"
            aria-expanded={isTransportMounted}
          >
            <FaBusAlt className="size-3.5" />
            {t("transportIncluded")}
          </button>
        ) : null}

        {isTransportMounted && pickupStops?.length ? (
          <div
            className={`absolute left-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2rem))] origin-top-left overflow-hidden rounded-2xl bg-black/75 text-white shadow-2xl shadow-black/40 backdrop-blur-md ring-1 ring-white/10 transition-[opacity,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] ${
              isTransportVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-0.5 scale-[0.98] opacity-0"
            }`}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <FaBusAlt className="size-3.5 shrink-0" />
              <p className="text-xs font-extrabold">{t("pickupPoints")}</p>
            </div>
            <div className="max-h-32 overflow-y-auto px-3 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pickupStops.map((stop) => (
                <div
                  key={`${stop.place}-${stop.time}`}
                  className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5 last:border-b-0"
                >
                  <span className="min-w-0 truncate text-xs font-bold text-white/85">
                    {stop.place}
                  </span>
                  <span className="shrink-0 text-[0.68rem] font-extrabold">
                    {stop.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold leading-tight">
        {experience.title}
      </h1>
      <p className="mt-1 text-sm font-semibold text-white/85">
        @{experience.company.replace(/\s+/g, "").toLowerCase()}
      </p>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsDescriptionOpen((current) => !current);
        }}
        onTouchMove={(event) => event.stopPropagation()}
        className={`mt-2 block w-full text-left text-sm leading-5 text-white/75 transition-[max-height,background-color,padding] duration-200 ease-out ${
          isDescriptionOpen
            ? "max-h-36 overscroll-contain overflow-y-auto rounded-2xl bg-black/20 p-3 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "line-clamp-2 max-h-10 overflow-hidden"
        }`}
        aria-expanded={isDescriptionOpen}
      >
        {description}
      </button>
      {isDescriptionOpen && (
        <button
          type="button"
          onClick={() => setIsDescriptionOpen(false)}
          className="mt-1 text-xs font-extrabold text-white/80"
        >
          Ver menos
        </button>
      )}

      <div className="mt-3 flex items-center gap-3 text-sm font-bold">
        <span className="inline-flex items-center gap-1">
          <MapPinIcon className="size-4" />
          {experience.province}
        </span>
        <span className="inline-flex items-center gap-1">
          <StarIcon className="size-4 fill-white" />
          {experience.rating}
        </span>
        <span>
          {t("from")} {formatExperiencePrice(experience)}
        </span>
      </div>
    </div>
  );
}
