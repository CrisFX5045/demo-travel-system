import {
  BoltIcon,
  CameraIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { ElementType } from "react";

import { SparkleFallbackIcon } from "../constants";

export function FilterChoiceGrid({
  activeFilters,
  filters,
  onSelectFilter,
  text,
}: {
  activeFilters: string[];
  filters: string[];
  onSelectFilter: (filter: string) => void;
  text: (value: string) => string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 min-[390px]:grid-cols-2">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter);
        const Icon = getFilterIcon(filter);
        const isLong = text(filter).length > 20;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onSelectFilter(filter)}
            className={`inline-flex max-w-full items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs font-extrabold transition active:scale-[0.98] ${
              isActive
                ? "border-gray-950 bg-gray-950 text-white shadow-sm shadow-gray-950/10"
                : "border-gray-200 bg-white text-gray-700"
            } ${isLong ? "min-[390px]:col-span-2" : ""}`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="block truncate">{text(filter)}</span>
          </button>
        );
      })}
    </div>
  );
}

function getFilterIcon(filter: string): ElementType {
  const icons: Record<string, ElementType> = {
    Aventura: BoltIcon,
    Playa: MapPinIcon,
    Montana: MapPinIcon,
    Naturaleza: SparkleFallbackIcon,
    Familiar: UserGroupIcon,
    Gastronomia: SparkleFallbackIcon,
    Wellness: ShieldCheckIcon,
    Cultura: GlobeAltIcon,
    "Incluye transporte": TruckIcon,
    Transporte: TruckIcon,
    "Guia certificado": ShieldCheckIcon,
    "Cancelacion gratis": ShieldCheckIcon,
    "Pet-friendly": SparkleFallbackIcon,
    "Ideal familias": UserGroupIcon,
    "Comida incluida": SparkleFallbackIcon,
    Fotografia: CameraIcon,
    "Equipo incluido": ShieldCheckIcon,
    "Recogida en hotel": MapPinIcon,
    "Guia bilingue": GlobeAltIcon,
    Accesible: ShieldCheckIcon,
    "Reserva inmediata": BoltIcon,
    "Tour privado": ShieldCheckIcon,
    "Grupos pequenos": UserGroupIcon,
    "Ninos bienvenidos": UserGroupIcon,
    Ofertas: CurrencyDollarIcon,
    "Menos de 30 min": BoltIcon,
    "Mayor calificacion": StarIcon,
    "Menos de CRC 25000": CurrencyDollarIcon,
    "CRC 25000 - 50000": CurrencyDollarIcon,
    "USD 50 - 100": CurrencyDollarIcon,
  };

  return icons[filter] ?? SparkleFallbackIcon;
}
