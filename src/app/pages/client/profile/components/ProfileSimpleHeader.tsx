import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function ProfileSimpleHeader({
  title,
  hint,
  backLabel,
  onBack,
}: {
  title: string;
  hint?: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-4 pb-4 pt-[calc(0.9rem+env(safe-area-inset-top))] backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-5xl min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="grid size-10 place-items-center rounded-full bg-gray-100 transition active:scale-95"
          aria-label={backLabel}
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold">{title}</h1>
          {hint ? (
            <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-500">
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
