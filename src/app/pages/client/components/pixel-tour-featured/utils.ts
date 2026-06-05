import type { TFunction } from "i18next";

import type { Experience } from "@/app/data/tourism";
import { experiences } from "@/app/data/tourism";

export const FEATURED_TOUR_IDS = ["EXP-1042", "EXP-1188", "EXP-1420"];

const FEATURED_TOUR_META: Record<
  string,
  { deadline: string; slotLabelKey: "double" | "sunset" | "private" }
> = {
  "EXP-1042": {
    deadline: "2026-06-08T18:00:00-06:00",
    slotLabelKey: "double",
  },
  "EXP-1188": {
    deadline: "2026-06-07T16:30:00-06:00",
    slotLabelKey: "sunset",
  },
  "EXP-1420": {
    deadline: "2026-06-09T12:00:00-06:00",
    slotLabelKey: "private",
  },
};

export function getFeaturedTours() {
  return FEATURED_TOUR_IDS.flatMap((id) => {
    const experience = experiences.find((item) => item.id === id);
    return experience ? [experience] : [];
  });
}

export function getTourImages(tour: Experience | null) {
  if (!tour) return [];
  return tour.images?.length ? tour.images : [tour.image];
}

export function getTourMeta(tour: Experience) {
  return FEATURED_TOUR_META[tour.id];
}

export function getSlotLabel(tour: Experience, t: TFunction) {
  return t(
    `client.pixelTour.featured.slotLabels.${getTourMeta(tour).slotLabelKey}`,
  );
}

export function getPeekLabel(tour: Experience, t: TFunction) {
  const badge = tour.promotion?.badge;
  const title = tour.promotion?.title;

  if (badge && title) return `${badge} - ${title}`;
  return badge ?? title ?? t("client.pixelTour.featured.offer");
}

export function formatTourPrice(price: number, currency: "USD" | "CRC") {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCountdownLabel(deadline: string, now: number, t: TFunction) {
  const diff = Math.max(0, new Date(deadline).getTime() - now);
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return t("client.pixelTour.featured.countdown.days", { days, hours });
  }

  if (hours > 0) {
    return t("client.pixelTour.featured.countdown.hours", { hours, minutes });
  }

  return t("client.pixelTour.featured.countdown.minutes", { minutes });
}
