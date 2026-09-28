import { IndianLanguage } from "@bis/shared-types";
import enTranslations from "./en.json";

export type TranslationDict = Record<string, string>;

// Default preloaded English fallback dictionary
export const fallbackDictionary: TranslationDict = enTranslations;

// Dynamic import loaders for on-demand language loading
const languageLoaders: Partial<
  Record<IndianLanguage, () => Promise<{ default: TranslationDict }>>
> = {
  [IndianLanguage.EN]: () => import("./en.json"),
  [IndianLanguage.HI]: () => import("./hi.json"),
  [IndianLanguage.TA]: () => import("./ta.json"),
  [IndianLanguage.TE]: () => import("./te.json"),
  [IndianLanguage.BN]: () => import("./bn.json"),
  [IndianLanguage.MR]: () => import("./mr.json"),
  [IndianLanguage.GU]: () => import("./gu.json"),
  [IndianLanguage.KN]: () => import("./kn.json"),
  [IndianLanguage.ML]: () => import("./ml.json"),
  [IndianLanguage.PA]: () => import("./pa.json"),
  [IndianLanguage.OR]: () => import("./or.json"),
  [IndianLanguage.UR]: () => import("./ur.json"),
  [IndianLanguage.AS]: () => import("./as.json"),
  [IndianLanguage.SAN]: () => import("./san.json"),
  [IndianLanguage.NEP]: () => import("./nep.json"),
  [IndianLanguage.KOK]: () => import("./kok.json"),
  [IndianLanguage.MAI]: () => import("./mai.json"),
  [IndianLanguage.DOG]: () => import("./dog.json"),
  [IndianLanguage.BOD]: () => import("./bod.json"),
  [IndianLanguage.MNI]: () => import("./mni.json"),
  [IndianLanguage.SAT]: () => import("./sat.json"),
  [IndianLanguage.KAS]: () => import("./kas.json"),
  [IndianLanguage.SD]: () => import("./sd.json"),
};

// In-memory cache of loaded dictionaries to prevent repeat fetches
const loadedDictionaryCache: Partial<Record<IndianLanguage, TranslationDict>> = {
  [IndianLanguage.EN]: enTranslations,
};

export async function loadLanguageDictionary(
  lang: IndianLanguage
): Promise<TranslationDict> {
  if (lang === IndianLanguage.EN) {
    return fallbackDictionary;
  }

  if (loadedDictionaryCache[lang]) {
    return loadedDictionaryCache[lang]!;
  }

  const loader = languageLoaders[lang];
  if (!loader) {
    return fallbackDictionary;
  }

  try {
    const module = await loader();
    loadedDictionaryCache[lang] = module.default;
    return module.default;
  } catch (error) {
    console.warn(`[i18n] Failed to dynamically load language dictionary for "${lang}":`, error);
    return fallbackDictionary;
  }
}
