import {
  BellAlertIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { type ElementType, useState } from "react";

import { useThemeContext } from "@/app/contexts/theme/context";

import type { ProfileCopy } from "../content";

export function ProfileSettingsPanel({ copy }: { copy: ProfileCopy }) {
  const { isDark, setThemeMode } = useThemeContext();
  const [travelAlerts, setTravelAlerts] = useState(true);
  const [saveSearches, setSaveSearches] = useState(true);
  const [locationRecommendations, setLocationRecommendations] = useState(false);

  return (
    <div className="grid gap-2">
      <SettingToggle
        icon={MoonIcon}
        title={copy.darkMode}
        hint={copy.darkModeHint}
        checked={isDark}
        onChange={(checked) => setThemeMode(checked ? "dark" : "light")}
      />
      <SettingToggle
        icon={BellAlertIcon}
        title={copy.travelAlerts}
        hint={copy.travelAlertsHint}
        checked={travelAlerts}
        onChange={setTravelAlerts}
      />
      <SettingToggle
        icon={MagnifyingGlassIcon}
        title={copy.saveSearches}
        hint={copy.saveSearchesHint}
        checked={saveSearches}
        onChange={setSaveSearches}
      />
      <SettingToggle
        icon={MapPinIcon}
        title={copy.locationRecommendations}
        hint={copy.locationRecommendationsHint}
        checked={locationRecommendations}
        onChange={setLocationRecommendations}
      />
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  hint,
  checked,
  onChange,
}: {
  icon: ElementType;
  title: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-gray-50 p-3 text-left dark:bg-dark-700/60">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white dark:bg-dark-600">
        <Icon className="size-5 text-gray-700 dark:text-dark-100" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-gray-950 dark:text-dark-50">
          {title}
        </span>
        <span className="mt-0.5 block line-clamp-2 text-xs font-semibold leading-5 text-gray-500 dark:text-dark-200">
          {hint}
        </span>
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-gray-950 dark:bg-primary-500" : "bg-gray-300 dark:bg-dark-450"
        }`}
        aria-pressed={checked}
        aria-label={title}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
