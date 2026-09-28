"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  IndianLanguage,
  LanguageInfo,
  getLanguageInfo,
} from "@bis/shared-types";
import {
  fallbackDictionary,
  loadLanguageDictionary,
  TranslationDict,
} from "@/locales";

interface I18nContextType {
  language: IndianLanguage;
  setLanguage: (lang: IndianLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languageInfo: LanguageInfo;
}

const I18nContext = createContext<I18nContextType>({
  language: IndianLanguage.EN,
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  languageInfo: getLanguageInfo(IndianLanguage.EN),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<IndianLanguage>(
    IndianLanguage.EN
  );
  const [activeDictionary, setActiveDictionary] =
    useState<TranslationDict>(fallbackDictionary);

  const switchLanguage = useCallback(async (lang: IndianLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("sentinelx_lang", lang);
    } catch {
      // ignore storage errors
    }

    if (lang === IndianLanguage.EN) {
      setActiveDictionary(fallbackDictionary);
    } else {
      const dict = await loadLanguageDictionary(lang);
      setActiveDictionary(dict);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sentinelx_lang") as IndianLanguage;
      if (
        saved &&
        Object.values(IndianLanguage).includes(saved) &&
        saved !== IndianLanguage.EN
      ) {
        switchLanguage(saved);
      }
    } catch {
      // ignore
    }
  }, [switchLanguage]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (activeDictionary && activeDictionary[key]) {
        return activeDictionary[key];
      }
      if (fallbackDictionary && fallbackDictionary[key]) {
        return fallbackDictionary[key];
      }
      return fallback || key;
    },
    [activeDictionary]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: switchLanguage,
        t,
        languageInfo: getLanguageInfo(language),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
