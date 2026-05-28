import {
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FaBusAlt } from "react-icons/fa";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../i18n";

type PickupStops = NonNullable<Experience["transport"]>["pickupStops"];

export const TransportPickupBadge = memo(function TransportPickupBadge({
  pickupStops,
  className = "",
}: {
  pickupStops?: PickupStops;
  className?: string;
}) {
  const { t } = useClientI18n();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearAnimationTimers = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearAnimationTimers();
    setIsMounted(true);
    setIsVisible(false);

    frameRef.current = requestAnimationFrame(() => {
      setIsVisible(true);
      frameRef.current = null;
    });
  }, [clearAnimationTimers]);

  const close = useCallback(() => {
    clearAnimationTimers();
    setIsVisible(false);

    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false);
      closeTimerRef.current = null;
    }, 240);
  }, [clearAnimationTimers]);

  const toggleOpen = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isMounted) {
        close();
      } else {
        open();
      }
    },
    [close, isMounted, open],
  );
  const stopPointerEvent = useCallback((event: ReactPointerEvent) => {
    event.stopPropagation();
  }, []);
  const closeFromButton = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      close();
    },
    [close],
  );

  useEffect(() => {
    return clearAnimationTimers;
  }, [clearAnimationTimers]);

  useEffect(() => {
    if (!isMounted) return;

    const closeOnOutsideClick = (event: globalThis.PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [close, isMounted]);

  if (!pickupStops?.length) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-20"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={stopPointerEvent}
    >
      <button
        type="button"
        onPointerDown={toggleOpen}
        className={`pointer-events-auto absolute grid size-9 place-items-center rounded-full bg-black/35 text-white shadow-lg shadow-black/15 backdrop-blur transition duration-100 active:scale-90 md:size-10 ${className}`}
        aria-label={t("viewTransportStops")}
        aria-expanded={isMounted}
      >
        <FaBusAlt className="size-4.5" />
      </button>

      {isMounted && (
        <div
          className={`pointer-events-auto absolute inset-0 flex origin-center flex-col overflow-hidden rounded-[1.15rem] bg-white text-gray-950 shadow-2xl shadow-black/25 ring-1 ring-gray-950/5 transition-[opacity,transform] duration-200 ease-out will-change-transform md:rounded-[1.35rem] ${
            isVisible
              ? "opacity-100 [transform:perspective(900px)_rotateY(0deg)]"
              : "opacity-0 [transform:perspective(900px)_rotateY(90deg)]"
          }`}
          aria-hidden={!isVisible}
        >
          <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-2.5 py-2 md:px-3">
            <div className="min-w-0">
              <p className="truncate text-[0.55rem] font-black uppercase leading-tight text-gray-500">
                {t("transportIncluded")}
              </p>
              <p className="truncate text-[0.72rem] font-extrabold leading-tight">
                {t("pickupPoints")}
              </p>
            </div>
            <button
              type="button"
              onClick={closeFromButton}
              className="grid size-6 shrink-0 place-items-center rounded-full bg-gray-100 transition active:scale-90"
              aria-label={t("closeTransport")}
            >
              <XMarkIcon className="size-3.5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-1.5 [scrollbar-width:thin] md:px-3">
            {pickupStops.map((stop) => (
              <div
                key={`${stop.place}-${stop.time}`}
                className="flex gap-1.5 border-b border-gray-100 py-1.5 last:border-b-0"
              >
                <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.7rem] font-extrabold leading-tight">
                    {stop.place}
                  </p>
                  <p className="text-[0.62rem] font-bold leading-tight text-gray-500">
                    {stop.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
