export function ExperienceCardSkeleton({
  variant = "rail",
}: {
  variant?: "rail" | "grid";
}) {
  return (
    <article
      className={
        variant === "grid"
          ? "min-w-0"
          : "w-[40vw] max-w-[16rem] shrink-0 md:w-auto md:max-w-none"
      }
    >
      <div className="aspect-[1.04] animate-pulse rounded-[1.15rem] bg-gray-100 md:rounded-[1.35rem]" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-100" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-100" />
      </div>
    </article>
  );
}

export function HorizontalExperienceSkeletons({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ExperienceCardSkeleton key={index} />
      ))}
    </>
  );
}

export function ProfileSummarySkeleton() {
  return (
    <section className="rounded-[1.75rem] bg-gray-950 p-5 shadow-xl shadow-gray-200/80 md:p-6">
      <div className="flex items-start gap-4">
        <div className="size-16 animate-pulse rounded-3xl bg-white/20 md:size-20" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-7 w-2/3 animate-pulse rounded-full bg-white/20" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/15" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full animate-pulse rounded-full bg-white/15" />
        <div className="h-2 w-full animate-pulse rounded-full bg-white/15" />
      </div>
    </section>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200/50">
      <div className="flex gap-3">
        <div className="size-16 animate-pulse rounded-2xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-100" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-100" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
