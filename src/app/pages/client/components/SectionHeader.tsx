import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

export function SectionHeader({
  title,
  subtitle,
  to,
}: {
  title: string;
  subtitle?: string;
  to?: string;
}) {
  const buttonClassName =
    "grid size-9 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-950 transition hover:bg-gray-200 active:scale-[0.98] md:size-11";

  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[1.42rem] font-extrabold leading-[1.08] text-gray-950 min-[390px]:text-[1.55rem] md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-5 text-gray-500 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {to ? (
        <Link to={to} className={buttonClassName} aria-label={`Ver ${title}`}>
          <ChevronRightIcon className="size-5 md:size-6" />
        </Link>
      ) : (
        <button className={buttonClassName} aria-label={`Ver ${title}`}>
          <ChevronRightIcon className="size-5 md:size-6" />
        </button>
      )}
    </div>
  );
}
