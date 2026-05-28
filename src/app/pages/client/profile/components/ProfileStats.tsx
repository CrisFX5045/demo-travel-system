import type { ProfileCopy } from "../content";
import { Link } from "react-router";

export function ProfileStats({
  copy,
}: {
  copy: ProfileCopy;
}) {
  const stats = [
    { label: copy.stats.trips, value: "8", href: "/client/profile/tours" },
    { label: copy.stats.favorites, value: "14", href: "/client/favorites" },
    { label: copy.stats.reviews, value: "5", href: "/client/profile/reviews" },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 md:gap-3">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.href}
          state={{ from: "/client/profile" }}
          className="rounded-3xl border border-gray-100 bg-white p-4 text-center shadow-sm shadow-gray-200/50"
        >
          <p className="text-2xl font-black md:text-3xl">{stat.value}</p>
          <p className="mt-1 truncate text-xs font-extrabold text-gray-500">
            {stat.label}
          </p>
        </Link>
      ))}
    </section>
  );
}
