import {
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export const RECENT_SEARCHES_KEY = "client_recent_searches";
export const fallbackRecentSearches = ["rafting", "playa", "Monteverde"];
export const dateFilterOptions = ["", "Proximo fin de semana"];
export const customDateFilter = "custom";
export const priceBounds = { min: 0, max: 1000000, step: 10000 };
export const usdToCrcReferenceRate = 520;

export const recommendedTourFilters = [
  "Incluye transporte",
  "Guia certificado",
  "Cancelacion gratis",
  "Pet-friendly",
  "Ideal familias",
];

export const tourServiceFilters = [
  "Comida incluida",
  "Fotografia",
  "Equipo incluido",
  "Recogida en hotel",
  "Guia bilingue",
  "Accesible",
];

export const bookingOptionFilters = [
  "Reserva inmediata",
  "Tour privado",
  "Grupos pequenos",
  "Ninos bienvenidos",
];

export const suggestedDestinations = [
  {
    title: "Cerca",
    description: "Descubre experiencias alrededor de tu ubicacion",
    value: "",
    icon: MapPinIcon,
  },
  {
    title: "Jaco",
    description: "Playa, aventura y tours de un dia",
    value: "Jaco",
    icon: SparkleFallbackIcon,
  },
  {
    title: "Monteverde",
    description: "Bosque nuboso, caminatas y naturaleza",
    value: "Monteverde",
    icon: SparkleFallbackIcon,
  },
];

export function SparkleFallbackIcon({ className }: { className?: string }) {
  return <StarIcon className={className} />;
}
