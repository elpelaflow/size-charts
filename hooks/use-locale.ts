"use client";

import { useState, useEffect, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import { translations } from "@/lib/i18n/translations";

const LOCALE_COOKIE = "locale";

function getCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)locale=(en|es)/);
  return match?.[1] === "es" ? "es" : "en";
}

function setCookieLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

/**
 * Client-side hook for accessing the current locale and translations.
 * Persists the preference in a cookie so server components can read it too.
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLocaleState(getCookieLocale());
    setIsLoaded(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookieLocale(newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale] as Record<string, string>;
      return dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;
    },
    [locale]
  );

  return { locale, setLocale, t, isLoaded };
}
