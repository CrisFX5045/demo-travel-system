import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { useThemeContext } from "@/app/contexts/theme/context";

import { useClientI18n } from "../i18n";

export function ClientThemeSwitch() {
  const { isDark, setThemeMode } = useThemeContext();
  const { t } = useClientI18n();

  return (
    <div className="rounded-3xl bg-gray-100 p-3 dark:bg-dark-700/70">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-gray-800 dark:bg-dark-600 dark:text-dark-50">
          {isDark ? (
            <MoonIcon className="size-5" />
          ) : (
            <SunIcon className="size-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-gray-950 dark:text-dark-50">
            {t("themeMode")}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-gray-500 dark:text-dark-200">
            {t("themeModeHint")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setThemeMode(isDark ? "light" : "dark")}
          className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition ${
            isDark ? "bg-gray-950 dark:bg-primary-500" : "bg-gray-300"
          }`}
          aria-pressed={isDark}
          aria-label={t("themeMode")}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${
              isDark ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
