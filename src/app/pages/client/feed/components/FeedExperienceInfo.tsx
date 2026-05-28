import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../../i18n";
import { formatExperiencePrice } from "../../price";

export function FeedExperienceInfo({
  experience,
}: {
  experience: Experience;
}) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { t, language, text } = useClientI18n();
  const description =
    language === "es"
      ? `${experience.company} te lleva a ${experience.zone}, ${experience.province}. Duracion ${experience.duration}, dificultad ${experience.difficulty.toLowerCase()}. Incluye ${experience.tags.join(", ")}. Proximo cupo: ${experience.nextSlot}.`
      : `${experience.company} takes you to ${experience.zone}, ${experience.province}. Duration ${experience.duration}, ${experience.difficulty.toLowerCase()} difficulty. Includes ${experience.tags.join(", ")}. Next slot: ${experience.nextSlot}.`;

  return (
    <div className="max-w-[calc(100%-4.5rem)] lg:max-w-full">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold">
          #{text(experience.category)}
        </span>
        {experience.promoted && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold">
            {experience.promotion?.badge ?? "Promo"}
          </span>
        )}
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
