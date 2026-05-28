import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export function ProfileHeader({
  title,
  eyebrow,
  backLabel,
  isVisible,
  onBack,
}: {
  title: string;
  eyebrow: string;
  backLabel: string;
  isVisible: boolean;
  onBack: () => void;
}) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b border-gray-100 bg-white/95 px-4 pb-4 pt-[calc(0.9rem+env(safe-area-inset-top))] backdrop-blur transition-transform duration-300 ease-out md:px-8 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-5xl min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="grid size-10 place-items-center rounded-full bg-gray-100 transition active:scale-95"
          aria-label={backLabel}
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-gray-500">{eyebrow}</p>
          <h1 className="truncate text-2xl font-extrabold">{title}</h1>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-gray-100 transition active:scale-95"
          aria-label="Settings"
        >
          <Cog6ToothIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}
