import type { Experience } from "@/app/data/tourism";

import { categoryTiles } from "../content";
import {
  customDateFilter,
  fallbackRecentSearches,
  priceBounds,
  RECENT_SEARCHES_KEY,
  usdToCrcReferenceRate,
} from "./constants";

export function readActiveFilters(searchParams: URLSearchParams) {
  const filters = searchParams.get("filters");
  const legacyFilter = searchParams.get("filter");
  const rawFilters = filters ? filters.split(",") : legacyFilter ? [legacyFilter] : [];

  return rawFilters
    .map((filter) => filter.trim())
    .filter((filter, index, list) => filter && list.indexOf(filter) === index);
}

export function toggleFilter(filters: string[], filter: string) {
  if (filters.includes(filter)) {
    return filters.filter((item) => item !== filter);
  }

  return [...filters, filter];
}

export function matchesSelectedFilters(experience: Experience, filters: string[]) {
  if (filters.length === 0) return true;

  const categoryFilters = filters.filter(isCategoryFilter);
  const detailFilters = filters.filter((filter) => !isCategoryFilter(filter));
  const matchesCategory =
    categoryFilters.length === 0 ||
    categoryFilters.some((filter) => matchesExperienceFilter(experience, filter));
  const matchesDetails = detailFilters.every((filter) =>
    matchesExperienceFilter(experience, filter),
  );

  return matchesCategory && matchesDetails;
}

export function matchesExperiencePriceRange(
  experience: Experience,
  minPrice: number,
  maxPrice: number,
) {
  const comparablePrice =
    experience.priceCurrency === "USD"
      ? experience.price * usdToCrcReferenceRate
      : experience.price;

  return comparablePrice >= minPrice && comparablePrice <= maxPrice;
}

export function matchesExperienceLocation(experience: Experience, location: string) {
  if (!location) return true;

  const normalizedLocation = location.toLowerCase();

  return [experience.province, experience.zone, ...experience.tags]
    .join(" ")
    .toLowerCase()
    .includes(normalizedLocation);
}

export function readRecentSearches() {
  if (typeof window === "undefined") return fallbackRecentSearches;

  try {
    const storedValue = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : null;

    if (Array.isArray(parsedValue) && parsedValue.length > 0) {
      return parsedValue.filter((item) => typeof item === "string").slice(0, 8);
    }
  } catch {
    return fallbackRecentSearches;
  }

  return fallbackRecentSearches;
}

export function readPriceParam(value: string | null, fallback: number) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) return fallback;

  return Math.min(priceBounds.max, Math.max(priceBounds.min, parsedValue));
}

export function readMaxPriceParam(value: string | null) {
  const parsedValue = readPriceParam(value, priceBounds.max);

  if (parsedValue <= priceBounds.min) return priceBounds.max;

  return parsedValue;
}

export function normalizePriceRange(
  minValue: number,
  maxValue: number,
  rangeMin: number,
  rangeMax: number,
  step: number,
) {
  const safeMin = Number.isFinite(minValue) ? minValue : rangeMin;
  const safeMax =
    Number.isFinite(maxValue) && maxValue > rangeMin ? maxValue : rangeMax;
  const nextMin = Math.max(rangeMin, Math.min(safeMin, rangeMax - step));
  const nextMax = Math.min(rangeMax, Math.max(safeMax, nextMin + step));

  return {
    min: nextMin,
    max: nextMax,
  };
}

export function hasCustomPriceRange(minPrice: number, maxPrice: number) {
  return minPrice > priceBounds.min || maxPrice < priceBounds.max;
}

export function formatPriceRangeLabel(minPrice: number, maxPrice: number) {
  return `${formatCrcPrice(minPrice)} - ${formatCrcPrice(maxPrice)}`;
}

export function getDateFilterLabel({
  activeDate,
  dateStart,
  dateEnd,
  allDatesLabel,
  customDatesLabel,
  text,
}: {
  activeDate: string;
  dateStart: string;
  dateEnd: string;
  allDatesLabel: string;
  customDatesLabel: string;
  text: (value: string) => string;
}) {
  if (activeDate === customDateFilter && dateStart) {
    if (!dateEnd || dateStart === dateEnd) return formatShortDate(dateStart);

    return `${formatShortDate(dateStart)} - ${formatShortDate(dateEnd)}`;
  }

  if (activeDate) return text(activeDate);

  if (dateStart) return customDatesLabel;

  return allDatesLabel;
}

export function getTodayInputValue() {
  return toDateInputValue(new Date());
}

function isCategoryFilter(filter: string) {
  return categoryTiles.some((category) => category.label === filter);
}

function matchesExperienceFilter(experience: Experience, filter: string) {
  if (filter === "Ofertas") return Boolean(experience.promoted);
  if (filter === "Mayor calificacion") return experience.rating >= 4.8;
  if (filter === "Menos de CRC 25000") {
    return experience.priceCurrency === "CRC" && experience.price < 25000;
  }
  if (filter === "CRC 25000 - 50000") {
    return (
      experience.priceCurrency === "CRC" &&
      experience.price >= 25000 &&
      experience.price <= 50000
    );
  }
  if (filter === "USD 50 - 100") {
    return (
      experience.priceCurrency === "USD" &&
      experience.price >= 50 &&
      experience.price <= 100
    );
  }

  if (experience.category === filter || experience.tags.includes(filter)) {
    return true;
  }

  const normalizedFilter = normalizeFilterAlias(filter).toLowerCase();
  const searchableText = [
    experience.title,
    experience.company,
    experience.category,
    experience.province,
    experience.zone,
    ...experience.tags,
  ]
    .join(" ")
    .toLowerCase();

  if (searchableText.includes(normalizedFilter)) return true;

  return [
    "Cancelacion gratis",
    "Reserva inmediata",
    "Recogida en hotel",
    "Guia bilingue",
    "Equipo incluido",
    "Accesible",
    "Grupos pequenos",
    "Ninos bienvenidos",
  ].includes(filter);
}

function normalizeFilterAlias(filter: string) {
  const aliases: Record<string, string> = {
    "Incluye transporte": "Transporte",
    "Ideal familias": "Familiar",
    "Tour privado": "Privado",
    "Comida incluida": "Comida incluida",
    Fotografia: "Fotografia",
    "Guia certificado": "Guia certificado",
    "Pet-friendly": "Pet-friendly",
  };

  return aliases[filter] ?? filter;
}

function formatCrcPrice(value: number) {
  return `CRC ${Math.round(value).toLocaleString("es-CR")}`;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatShortDate(dateValue: string) {
  const [, month, day] = dateValue.split("-");
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const monthIndex = Number(month) - 1;

  return `${Number(day)} ${monthNames[monthIndex] ?? ""}`;
}
