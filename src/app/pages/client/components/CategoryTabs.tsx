import type { ClientTab } from "../content";
import { useClientI18n } from "../i18n";

export function CategoryTabs({
  tabs,
  activeTab,
  onSelectTab,
  showImages = true,
}: {
  tabs: ClientTab[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  showImages?: boolean;
}) {
  const { t, text } = useClientI18n();

  return (
    <section className="border-b border-gray-100 px-1 py-1 md:px-8 md:py-5">
      <div
        className={`mx-auto flex max-w-3xl items-end justify-between gap-3 md:justify-center ${
          showImages ? "md:gap-12" : "md:gap-3"
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.label === activeTab;

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onSelectTab(tab.label)}
              className={`relative flex min-w-0 flex-1 flex-col items-center pb-2 md:flex-none ${
                showImages ? "md:min-w-24" : "md:min-w-32"
              }`}
            >
              {showImages && tab.badge && (
                <span className="absolute -top-1 right-0 rounded-md bg-slate-600 px-1.5 py-0.5 text-[0.62rem] font-extrabold text-white shadow-md">
                  {t("new")}
                </span>
              )}
              {showImages && (
                <img
                  src={tab.image}
                  alt=""
                  className="size-10 rounded-xl object-cover min-[390px]:size-11 md:size-14"
                />
              )}
              <span
                className={`text-sm font-bold text-gray-600 min-[390px]:text-base ${
                  showImages ? "mt-1" : "py-1"
                }`}
              >
                {text(tab.label)}
              </span>
              <span
                className={`absolute inset-x-2 -bottom-px h-1 origin-center rounded-full bg-gray-950 transition-transform duration-300 ease-out md:inset-x-0 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
