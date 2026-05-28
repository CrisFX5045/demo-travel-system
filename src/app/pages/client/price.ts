import type { Experience } from "@/app/data/tourism";
import type { ClientLanguage } from "./i18n";

type PriceableExperience = Pick<Experience, "price" | "priceCurrency">;

export function formatExperiencePrice(experience: PriceableExperience) {
  if (experience.priceCurrency === "CRC") {
    return `CRC ${new Intl.NumberFormat("es-CR").format(experience.price)}`;
  }

  return `$${new Intl.NumberFormat("en-US").format(experience.price)}`;
}

export function formatExperiencePriceLine(
  experience: PriceableExperience,
  language: ClientLanguage = "es",
) {
  const from = language === "es" ? "Desde" : "From";
  const perPerson = language === "es" ? "por persona" : "per person";

  return `${from} ${formatExperiencePrice(experience)} ${perPerson}`;
}

export function getPromotionPrice(experience: Experience) {
  const discountPercent = experience.promotion?.discountPercent;

  if (!discountPercent) return null;

  const finalPrice = Math.round(experience.price * (1 - discountPercent / 100));
  const finalExperience = {
    price: finalPrice,
    priceCurrency: experience.priceCurrency,
  };

  return {
    discountPercent,
    original: formatExperiencePrice(experience),
    final: formatExperiencePrice(finalExperience),
  };
}
