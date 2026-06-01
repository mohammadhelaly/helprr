import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { appSettings } from "@/lib/db/schema";

const appAppearanceKey = "app-appearance";
const appearancePreferences = ["system", "light", "dark"] as const;
const defaultAppearancePreference = "light" satisfies AppearancePreference;

type AppearancePreference = (typeof appearancePreferences)[number];
type ResolvedColorScheme = Exclude<AppearancePreference, "system">;

const isAppearancePreference = (
  value: string,
): value is AppearancePreference => {
  return appearancePreferences.includes(value as AppearancePreference);
};

const normalizeAppearancePreference = (
  value?: string | null,
): AppearancePreference => {
  return value && isAppearancePreference(value)
    ? value
    : defaultAppearancePreference;
};

const getAppAppearancePreference = (): AppearancePreference => {
  const setting = db
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, appAppearanceKey))
    .get();

  const normalized = normalizeAppearancePreference(setting?.value);

  if (setting && setting.value !== normalized) {
    setAppAppearancePreference(normalized);
  }

  return normalized;
};

const setAppAppearancePreference = (appearance: AppearancePreference) => {
  db.insert(appSettings)
    .values({ key: appAppearanceKey, value: appearance })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value: appearance },
    })
    .run();
};

export {
  appearancePreferences,
  defaultAppearancePreference,
  getAppAppearancePreference,
  isAppearancePreference,
  setAppAppearancePreference,
};
export type { AppearancePreference, ResolvedColorScheme };
