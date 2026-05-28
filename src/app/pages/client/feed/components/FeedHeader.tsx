import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { useClientI18n } from "../../i18n";

export function FeedHeader({ onBack }: { onBack: () => void }) {
  const { t } = useClientI18n();

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto flex max-w-[38rem] items-center justify-between px-4 pt-[calc(0.8rem+env(safe-area-inset-top))] [animation:client-feed-header-in_420ms_80ms_cubic-bezier(.22,1,.36,1)_both] lg:left-1/2 lg:-translate-x-1/2"
    >
      <button
        type="button"
        onClick={onBack}
        className="pointer-events-auto grid size-10 place-items-center rounded-full bg-black/35 backdrop-blur"
        aria-label={t("back")}
      >
        <ArrowLeftIcon className="size-6" />
      </button>
      <div className="pointer-events-auto rounded-full bg-black/25 p-1 text-sm font-extrabold backdrop-blur">
        <button className="rounded-full bg-white px-4 py-2 text-gray-950">
          {t("explore")}
        </button>
        <button className="px-4 py-2 text-white/80">{t("location")}</button>
      </div>
      <div className="size-10" />
    </header>
  );
}
