import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { useClientI18n } from "../i18n";

export function FilterRail({
  filters,
  activeType,
  onOpenFilters,
}: {
  filters: string[];
  activeType: string;
  onOpenFilters: () => void;
}) {
  const { t, text } = useClientI18n();

  return (
    <section className="relative z-20 bg-white px-4 py-3 md:px-8 md:py-5">
      <div className="flex max-w-full gap-2.5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] md:gap-3 md:pb-2 [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm font-extrabold md:px-5 md:py-3 md:text-base"
        >
          <AdjustmentsHorizontalIcon className="size-4 md:size-5" />
          {t("filters")}
        </button>
        {filters.map((filter) => (
          <Link
            key={filter}
            to={`/client/explore?type=${encodeURIComponent(activeType)}&filter=${encodeURIComponent(filter)}`}
            className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm font-extrabold md:px-5 md:py-3 md:text-base"
          >
            {text(filter)}
            {filter.includes("Costo") && (
              <ChevronDownIcon className="size-4" />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
