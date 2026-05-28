import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import type { ProfileCopy } from "../content";

export function TravelerSummary({
  copy,
  isIdentityVerified,
}: {
  copy: ProfileCopy;
  isIdentityVerified: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-gray-950 text-white shadow-xl shadow-gray-200/80">
      <div className="relative p-5 md:p-6">
        <div className="absolute -right-10 -top-16 size-40 rounded-full bg-white/10" />
        <div className="absolute bottom-3 right-6 size-20 rounded-full bg-emerald-400/20" />

        <div className="relative flex items-start gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-white text-2xl font-black text-gray-950 md:size-20">
            CR
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-extrabold md:text-3xl">
                Cristina Vargas
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-xs font-extrabold text-white/90">
                <CheckBadgeIcon className="size-4 text-sky-300" />
                {copy.verified}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-white/65">
              {copy.memberSince}
            </p>
          </div>
        </div>

        {!isIdentityVerified && (
          <button
            type="button"
            className="relative mt-5 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-gray-950 transition active:scale-[0.98]"
          >
            {copy.verifyIdentity}
          </button>
        )}

        <div className="relative mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-white/75">
            <span>{copy.profileCompletion}</span>
            <span>82%</span>
          </div>
          <div className="h-2 rounded-full bg-white/15">
            <div className="h-full w-[82%] rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
