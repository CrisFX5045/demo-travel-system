import type { ProfilePreference } from "../content";

export function PreferencesGrid({
  preferences,
}: {
  preferences: ProfilePreference[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {preferences.map((preference) => (
        <div
          key={preference.label}
          className="rounded-3xl bg-gray-50 p-4"
        >
          <preference.icon className="size-5 text-gray-500" />
          <p className="mt-3 text-xs font-bold text-gray-500">
            {preference.label}
          </p>
          <p className="mt-1 text-sm font-extrabold text-gray-950">
            {preference.value}
          </p>
        </div>
      ))}
    </div>
  );
}
