import { SparklesIcon } from "@heroicons/react/24/outline";

import { useClientI18n } from "../i18n";

export function MapPreviewSection() {
  const { t } = useClientI18n();

  return (
    <section id="map" className="px-4 py-8 md:px-8 md:py-10">
      <div className="overflow-hidden rounded-3xl bg-gray-100 p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-primary-600">
              <SparklesIcon className="size-5" />
              {t("mapRecommendations")}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              {t("mapPreviewTitle")}
            </h2>
            <p className="mt-3 text-sm text-gray-500 md:text-base">
              {t("mapPreviewSubtitle")}
            </p>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-3xl bg-white md:min-h-80">
            <img
              src="/images/travel/travel-16.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute left-4 top-5 rounded-2xl bg-white p-3 shadow-xl md:left-8 md:top-10 md:p-4">
              <p className="font-extrabold">Monteverde</p>
              <p className="text-sm text-gray-500">
                17 {t("experiencesCount")}
              </p>
            </div>
            <div className="absolute bottom-5 right-4 rounded-2xl bg-white p-3 shadow-xl md:bottom-8 md:right-8 md:p-4">
              <p className="font-extrabold">Tamarindo</p>
              <p className="text-sm text-gray-500">
                24 {t("experiencesCount")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
