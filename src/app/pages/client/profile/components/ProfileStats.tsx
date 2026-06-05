import type { ProfileCopy } from "../content";
import { Link } from "react-router";

export function ProfileStats({
  copy,
  stats,
  isLoading = false,
}: {
  copy: ProfileCopy;
  stats?: {
    trips?: number;
    favorites?: number;
    reviews?: number;
  };
  isLoading?: boolean;
}) {
  const profileStats = [
    {
      label: copy.stats.trips,
      value: stats?.trips,
      href: "/client/profile/tours",
    },
    {
      label: copy.stats.favorites,
      value: stats?.favorites,
      href: "/client/favorites",
    },
    {
      label: copy.stats.reviews,
      value: stats?.reviews,
      href: "/client/profile/reviews",
    },
  ];

  return (
    <section className="grid h-fit grid-cols-3 items-start gap-2 md:gap-3">
      {profileStats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.href}
          state={{ from: "/client/profile" }}
          className="rounded-3xl border border-gray-100 bg-white p-4 text-center shadow-sm shadow-gray-200/50"
        >
          {isLoading ? (
            <div className="mx-auto h-8 w-10 animate-pulse rounded-full bg-gray-100" />
          ) : (
            <p className="text-2xl font-black md:text-3xl">
              {typeof stat.value === "number" ? stat.value : "-"}
            </p>
          )}
          <p className="mt-1 truncate text-xs font-extrabold text-gray-500">
            {stat.label}
          </p>
        </Link>
      ))}
    </section>
  );
}
