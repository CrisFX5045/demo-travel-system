import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { ProfileAction } from "../content";

export function ProfileActionList({
  actions,
  openLabel,
}: {
  actions: ProfileAction[];
  openLabel: string;
}) {
  return (
    <div className="grid gap-2">
      {actions.map((action) => {
        const content = (
          <>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gray-100">
              <action.icon className="size-5 text-gray-700" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold">
                {action.label}
              </span>
              <span className="mt-0.5 block line-clamp-2 text-xs font-semibold leading-5 text-gray-500">
                {action.description}
              </span>
            </span>
            <ChevronRightIcon className="size-5 shrink-0 text-gray-400" />
          </>
        );
        const className =
          "flex min-w-0 items-center gap-3 rounded-3xl bg-gray-50 p-3 text-left transition active:scale-[0.99]";

        if (action.href) {
          return (
            <Link
              key={action.label}
              to={action.href}
              className={className}
              aria-label={`${openLabel} ${action.label}`}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={action.label}
            type="button"
            className={className}
            aria-label={`${openLabel} ${action.label}`}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
