import type { ReactNode } from "react";
import { Link } from "react-router";

export function ProfileSection({
  title,
  hint,
  actionLabel,
  actionHref,
  children,
}: {
  title: string;
  hint?: string;
  actionLabel?: string;
  actionHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="h-fit rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200/60 md:p-5">
      <div className="mb-4 flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold">{title}</h2>
          {hint ? (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
              {hint}
            </p>
          ) : null}
        </div>
        {actionLabel && actionHref ? (
          <Link
            to={actionHref}
            className="shrink-0 rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold transition active:scale-[0.98]"
          >
            {actionLabel}
          </Link>
        ) : actionLabel ? (
          <button
            type="button"
            className="shrink-0 rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold transition active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
