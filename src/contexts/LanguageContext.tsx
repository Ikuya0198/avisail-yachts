"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Import translations
import en from "../../messages/en.json";
import ja from "../../messages/ja.json";
import ar from "../../messages/ar.json";

export const locales = ["en", "ja", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  ja: "🇯🇵",
  ar: "🇸🇦",
};

const messages: Record<Locale, typeof en> = { en, ja, ar };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return key if not found
    }
  }

  return typeof result === "string" ? result : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get locale from localStorage or browser
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && locales.includes(stored)) {
      setLocaleState(stored);
    } else {
      // Try browser language
      const browserLang = navigator.language.substring(0, 2);
      if (locales.includes(browserLang as Locale)) {
        setLocaleState(browserLang as Locale);
      }
    }
    setIsInitialized(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Set cookie for potential SSR usage
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let translation = getNestedValue(messages[locale] as Record<string, unknown>, key);

      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          translation = translation.replace(`{${paramKey}}`, String(value));
        });
      }

      return translation;
    },
    [locale]
  );

  const isRtl = locale === "ar";

  // Update document direction when locale changes
  useEffect(() => {
    if (isInitialized) {
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = locale;
    }
  }, [locale, isRtl, isInitialized]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
