import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";

import type { ProfileCopy } from "../content";

export function TravelerSummary({
  copy,
  isIdentityVerified,
  fullName,
  memberSince,
  profileCompletion,
  avatarUrl,
}: {
  copy: ProfileCopy;
  isIdentityVerified: boolean;
  fullName: string;
  memberSince?: string;
  profileCompletion: number;
  avatarUrl?: string | null;
}) {
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const displayedMemberSince = formatMemberSince(memberSince, copy.memberSince);
  const verificationLabel = isIdentityVerified ? copy.verified : copy.notVerified;
  const VerificationIcon = isIdentityVerified ? CheckBadgeIcon : XCircleIcon;

  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-gray-950 text-white shadow-xl shadow-gray-200/80">
      <div className="relative p-5 md:p-6">
        <div className="absolute -right-10 -top-16 size-40 rounded-full bg-white/10" />
        <div className="absolute bottom-3 right-6 size-20 rounded-full bg-emerald-400/20" />

        <div className="relative flex items-start gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="size-16 shrink-0 rounded-3xl bg-white object-cover md:size-20"
              draggable={false}
            />
          ) : (
            <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-white text-2xl font-black text-gray-950 md:size-20">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-extrabold md:text-3xl">
                {fullName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-xs font-extrabold text-white/90">
                <VerificationIcon
                  className={`size-4 ${
                    isIdentityVerified ? "text-sky-300" : "text-rose-300"
                  }`}
                />
                {verificationLabel}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-white/65">
              {displayedMemberSince}
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
            <span>{profileCompletion}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <button
            type="button"
            className="mt-3 rounded-full bg-white/12 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-white/18 active:scale-[0.98]"
          >
            {copy.completeProfile}
          </button>
        </div>
      </div>
    </section>
  );
}

function formatMemberSince(value: string | undefined, fallback: string) {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return fallback.replace(/\d{4}/, String(date.getFullYear()));
}
