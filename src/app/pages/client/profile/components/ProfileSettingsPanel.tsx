import {
  BellAlertIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { type ElementType, useEffect, useState } from "react";

import { authApi } from "@/app/api/services";
import type { TravelerProfile } from "@/app/api/types";
import { useThemeContext } from "@/app/contexts/theme/context";

import type { ProfileCopy } from "../content";

export function ProfileSettingsPanel({
  copy,
  profile,
  darkMode,
  onProfileUpdated,
}: {
  copy: ProfileCopy;
  profile?: TravelerProfile | null;
  darkMode?: boolean;
  onProfileUpdated?: (profile: TravelerProfile) => void;
}) {
  const { isDark, setThemeMode, themeMode } = useThemeContext();
  const [travelAlerts, setTravelAlerts] = useState(true);
  const [saveSearches, setSaveSearches] = useState(true);
  const [locationRecommendations, setLocationRecommendations] = useState(false);
  const [isSavingDarkMode, setIsSavingDarkMode] = useState(false);

  useEffect(() => {
    if (typeof darkMode !== "boolean") return;

    const preferredTheme = darkMode ? "dark" : "light";
    if (themeMode !== preferredTheme) {
      setThemeMode(preferredTheme);
    }
    // setThemeMode is recreated by ThemeProvider on each render.
    // Including it here can cause repeated localStorage writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode, themeMode]);

  return (
    <div className="grid gap-2">
      <SettingToggle
        icon={MoonIcon}
        title={copy.darkMode}
        hint={copy.darkModeHint}
        checked={isDark}
        disabled={isSavingDarkMode}
        onChange={(checked) => {
          void handleDarkModeChange(checked);
        }}
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

  async function handleDarkModeChange(checked: boolean) {
    const previousTheme = themeMode;
    const nextTheme = checked ? "dark" : "light";

    setThemeMode(nextTheme);
    setIsSavingDarkMode(true);

    try {
      const updatedProfile = await authApi.updateProfile({
        fullName: profile?.fullName,
        phone: profile?.phone,
        avatarUrl: profile?.avatarUrl || null,
        preferredLanguage: profile?.preferredLanguage,
        preferredCurrency: profile?.preferredCurrency,
        darkMode: checked,
      });

      onProfileUpdated?.({
        ...(profile ?? {}),
        ...updatedProfile,
        darkMode: checked,
      });
    } catch (error) {
      setThemeMode(previousTheme);
      console.error("No se pudo actualizar el perfil.", error);
    } finally {
      setIsSavingDarkMode(false);
    }
  }
}

function SettingToggle({
  icon: Icon,
  title,
  hint,
  checked,
  disabled = false,
  onChange,
}: {
  icon: ElementType;
  title: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
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
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-gray-950 dark:bg-primary-500" : "bg-gray-300 dark:bg-dark-450"
        } ${disabled ? "cursor-wait opacity-70" : ""}`}
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
