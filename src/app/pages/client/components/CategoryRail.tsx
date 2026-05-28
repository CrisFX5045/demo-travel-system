import { Link } from "react-router";

import type { CategoryTile } from "../content";
import { useClientI18n } from "../i18n";

export function CategoryRail({
  categories,
  activeType,
}: {
  categories: CategoryTile[];
  activeType: string;
}) {
  const { text } = useClientI18n();

  return (
    <section className="border-b border-gray-100 px-4 py-3 md:px-8 md:py-4">
      <div className="flex justify-between  max-w-full items-center gap-5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] md:gap-8 md:pb-2 [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <Link
            key={category.label}
            to={`/client/explore?type=${encodeURIComponent(activeType)}&category=${encodeURIComponent(category.label)}`}
            className="shrink-0 text-center"
          >
            <img
              src={category.image}
              alt=""
              className="mx-auto size-12 rounded-2xl object-cover md:size-16"
            />
            <span className="mt-1.5 block text-xs font-bold md:mt-2 md:text-sm">
              {text(category.label)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
