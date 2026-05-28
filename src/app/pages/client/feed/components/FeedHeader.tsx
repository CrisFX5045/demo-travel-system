import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";

import { provinces } from "@/app/data/tourism";

import { useClientI18n } from "../../i18n";

export function FeedHeader({
  selectedProvince,
  onBack,
  onSelectProvince,
}: {
  selectedProvince: string;
  onBack: () => void;
  onSelectProvince: (province: string) => void;
}) {
  const { t } = useClientI18n();
  const [isLocationMounted, setIsLocationMounted] = useState(false);
  const [isLocationVisible, setIsLocationVisible] = useState(false);
  const locationFrameRef = useRef<number | null>(null);
  const locationTimerRef = useRef<number | null>(null);
  const provinceOptions = [t("anyLocation"), ...provinces];
  const selectedLabel = selectedProvince || t("anyLocation");

  const clearLocationAnimation = useCallback(() => {
    if (locationFrameRef.current !== null) {
      cancelAnimationFrame(locationFrameRef.current);
      locationFrameRef.current = null;
    }

    if (locationTimerRef.current !== null) {
      window.clearTimeout(locationTimerRef.current);
      locationTimerRef.current = null;
    }
  }, []);

  const openLocationPicker = useCallback(() => {
    clearLocationAnimation();
    setIsLocationMounted(true);
    setIsLocationVisible(false);

    locationFrameRef.current = requestAnimationFrame(() => {
      setIsLocationVisible(true);
      locationFrameRef.current = null;
    });
  }, [clearLocationAnimation]);

  const closeLocationPicker = useCallback(() => {
    clearLocationAnimation();
    setIsLocationVisible(false);

    locationTimerRef.current = window.setTimeout(() => {
      setIsLocationMounted(false);
      locationTimerRef.current = null;
    }, 180);
  }, [clearLocationAnimation]);

  const toggleLocationPicker = useCallback(() => {
    if (isLocationMounted) {
      closeLocationPicker();
    } else {
      openLocationPicker();
    }
  }, [closeLocationPicker, isLocationMounted, openLocationPicker]);

  useEffect(() => {
    return clearLocationAnimation;
  }, [clearLocationAnimation]);

  return (
    <>
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex max-w-[38rem] items-center justify-between px-4 pt-[calc(0.8rem+env(safe-area-inset-top))] [animation:client-feed-header-in_420ms_80ms_cubic-bezier(.22,1,.36,1)_both] lg:left-1/2 lg:-translate-x-1/2"
      >
      <button
        type="button"
        onClick={onBack}
        className="pointer-events-auto grid size-10 place-items-center rounded-full bg-black/35 backdrop-blur"
        aria-label={t("back")}
      >
        <ArrowLeftIcon className="size-6" />
      </button>
      <div
        className="pointer-events-auto relative rounded-full bg-black/25 p-1 text-sm font-extrabold backdrop-blur"
      >
        <button
          type="button"
          onClick={() => {
            if (selectedProvince) onSelectProvince("");
            closeLocationPicker();
          }}
          className={`rounded-full px-4 py-2 transition ${
            selectedProvince || isLocationMounted
              ? "text-white/80"
              : "bg-white text-gray-950"
          }`}
        >
          {t("explore")}
        </button>
        <button
          type="button"
          onClick={toggleLocationPicker}
          className={`rounded-full px-4 py-2 transition ${
            selectedProvince || isLocationMounted
              ? "bg-white text-gray-950"
              : "text-white/80"
          }`}
          aria-expanded={isLocationMounted}
        >
          {t("location")}
        </button>
      </div>
        <div className="size-10" />
      </header>

      {isLocationMounted && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            onClick={closeLocationPicker}
            className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ease-out ${
              isLocationVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Cerrar ubicaciones"
          />
          <section
            className={`absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-[38rem] overflow-hidden bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(5.6rem+env(safe-area-inset-top))] text-gray-950 shadow-2xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
              isLocationVisible
                ? "scale-100 opacity-100"
                : "scale-[1.02] opacity-0"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-gray-500">
                  {t("exploringIn")}
                </p>
                <h2 className="mt-1 truncate text-2xl font-extrabold">
                  {selectedLabel}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectProvince("");
                  closeLocationPicker();
                }}
                className="shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-extrabold text-gray-700"
              >
                {t("explore")}
              </button>
            </div>
            <div className="mt-5 grid max-h-[calc(100svh-11rem)] gap-2 overflow-y-auto pr-1 [scrollbar-width:none] sm:grid-cols-2 [&::-webkit-scrollbar]:hidden">
              {provinceOptions.map((province) => {
                const provinceValue =
                  province === t("anyLocation") ? "" : province;
                const isSelected = provinceValue === selectedProvince;

                return (
                  <button
                    key={province}
                    type="button"
                    onClick={() => {
                      onSelectProvince(provinceValue);
                      closeLocationPicker();
                    }}
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition active:scale-[0.98] ${
                      isSelected
                        ? "bg-gray-950 text-white shadow-lg shadow-gray-950/15"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span>{province}</span>
                    {isSelected && <CheckIcon className="size-4" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
