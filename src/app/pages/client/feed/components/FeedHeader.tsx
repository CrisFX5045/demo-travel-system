import { ArrowLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
        className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex max-w-[38rem] items-center justify-between px-4 pt-[calc(0.8rem+env(safe-area-inset-top))] [animation:client-feed-header-in_420ms_80ms_cubic-bezier(.22,1,.36,1)_both] lg:left-[21rem] lg:right-[18rem] lg:max-w-none lg:translate-x-0"
      >
      <button
        type="button"
        onClick={onBack}
        className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-gray-950 shadow-lg shadow-gray-950/10 backdrop-blur transition hover:bg-white dark:bg-black/35 dark:text-white dark:shadow-none"
        aria-label={t("back")}
      >
        <ArrowLeftIcon className="size-6" />
      </button>
      <div
        className="pointer-events-auto relative rounded-full bg-black/25 p-1 text-sm font-extrabold text-gray-950 shadow-lg shadow-gray-950/10 backdrop-blur dark:bg-black/25 dark:text-white dark:shadow-none"
      >
        <button
          type="button"
          onClick={() => {
            if (selectedProvince) onSelectProvince("");
            closeLocationPicker();
          }}
          className={`rounded-full px-4 py-2 transition ${
            selectedProvince || isLocationMounted
              ? "text-white/80 dark:text-white/80"
              : "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
          }`}
        >
          {t("explore")}
        </button>
        <button
          type="button"
          onClick={toggleLocationPicker}
          className={`rounded-full px-4 py-2 transition ${
            selectedProvince || isLocationMounted
              ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
              : "text-white/80 dark:text-white/80"
          }`}
          aria-expanded={isLocationMounted}
        >
          {t("location")}
        </button>
      </div>
        <div className="size-10" />
      </header>

      {isLocationMounted && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            onClick={closeLocationPicker}
            className={`absolute inset-0 bg-gray-950/45 backdrop-blur-sm transition-opacity duration-200 ease-out ${
              isLocationVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Cerrar ubicaciones"
          />
          <section
            className={`absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-[38rem] overflow-hidden bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(5.6rem+env(safe-area-inset-top))] text-gray-950 shadow-2xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] dark:bg-[#151515] dark:text-white lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:top-[5.7rem] lg:max-h-[min(78svh,42rem)] lg:w-[32rem] lg:-translate-x-1/2 lg:rounded-[2rem] lg:border lg:border-gray-200 lg:px-5 lg:pb-5 lg:pt-5 lg:shadow-gray-950/20 lg:dark:border-white/10 ${
              isLocationVisible
                ? "scale-100 opacity-100"
                : "scale-[1.02] opacity-0"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-gray-500 dark:text-white/50">
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
                className="shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-extrabold text-gray-700 transition hover:bg-gray-200 hover:text-gray-950 active:scale-95 dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/15 dark:hover:text-white"
              >
                {t("explore")}
              </button>
              <button
                type="button"
                onClick={closeLocationPicker}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 hover:text-gray-950 active:scale-95 dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/15 dark:hover:text-white"
                aria-label="Cerrar ubicaciones"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
            <div className="mt-5 grid max-h-[calc(100svh-11rem)] gap-2 overflow-y-auto pr-1 [scrollbar-width:none] sm:grid-cols-2 lg:max-h-[min(56svh,29rem)] [&::-webkit-scrollbar]:hidden">
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
                        ? "bg-gray-950 text-white shadow-lg shadow-gray-950/15 dark:bg-white dark:text-gray-950"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white"
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
