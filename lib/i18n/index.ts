import { cookies } from "next/headers";
import { translations } from "./translations";

export type Locale = "en" | "es";

export const LOCALE_COOKIE = "locale";

/**
 * Get the current locale from cookies (for Server Components).
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  return locale === "es" ? "es" : "en";
}

/**
 * Get a translation function for the given locale (for Server Components).
 */
export async function getT(): Promise<(key: string) => string> {
  const locale = await getLocale();
  return (key: string) => {
    const dict = translations[locale] as Record<string, string>;
    return dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  };
}
