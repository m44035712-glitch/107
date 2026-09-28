import { IndianLanguage } from "./enums";

export interface LanguageInfo {
  code: IndianLanguage;
  name: string;
  nativeName: string;
  script: string;
  nllbCode: string;
  indicTransCode?: string;
  isScheduled22: boolean;
}

export const SUPPORTED_LANGUAGES: Record<IndianLanguage, LanguageInfo> = {
  [IndianLanguage.EN]: {
    code: IndianLanguage.EN,
    name: "English",
    nativeName: "English",
    script: "Latin",
    nllbCode: "eng_Latn",
    indicTransCode: "eng_Latn",
    isScheduled22: false,
  },
  [IndianLanguage.HI]: {
    code: IndianLanguage.HI,
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    nllbCode: "hin_Deva",
    indicTransCode: "hin_Deva",
    isScheduled22: true,
  },

  [IndianLanguage.AS]: {
    code: IndianLanguage.AS,
    name: "Assamese",
    nativeName: "অসমীয়া",
    script: "Bengali-Assamese",
    nllbCode: "asm_Beng",
    indicTransCode: "asm_Beng",
    isScheduled22: true,
  },
  [IndianLanguage.BN]: {
    code: IndianLanguage.BN,
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    nllbCode: "ben_Beng",
    indicTransCode: "ben_Beng",
    isScheduled22: true,
  },
  [IndianLanguage.BOD]: {
    code: IndianLanguage.BOD,
    name: "Bodo",
    nativeName: "बर’",
    script: "Devanagari",
    nllbCode: "bod_Deva",
    indicTransCode: "bod_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.DOG]: {
    code: IndianLanguage.DOG,
    name: "Dogri",
    nativeName: "डोगरी",
    script: "Devanagari",
    nllbCode: "doi_Deva",
    indicTransCode: "doi_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.GU]: {
    code: IndianLanguage.GU,
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    script: "Gujarati",
    nllbCode: "guj_Gujr",
    indicTransCode: "guj_Gujr",
    isScheduled22: true,
  },
  [IndianLanguage.KN]: {
    code: IndianLanguage.KN,
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    script: "Kannada",
    nllbCode: "kan_Knda",
    indicTransCode: "kan_Knda",
    isScheduled22: true,
  },
  [IndianLanguage.KAS]: {
    code: IndianLanguage.KAS,
    name: "Kashmiri",
    nativeName: "کٲشُر",
    script: "Perso-Arabic",
    nllbCode: "kas_Arab",
    indicTransCode: "kas_Arab",
    isScheduled22: true,
  },
  [IndianLanguage.KOK]: {
    code: IndianLanguage.KOK,
    name: "Konkani",
    nativeName: "कोंकणी",
    script: "Devanagari",
    nllbCode: "gom_Deva",
    indicTransCode: "gom_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.MAI]: {
    code: IndianLanguage.MAI,
    name: "Maithili",
    nativeName: "मैथिली",
    script: "Devanagari",
    nllbCode: "mai_Deva",
    indicTransCode: "mai_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.ML]: {
    code: IndianLanguage.ML,
    name: "Malayalam",
    nativeName: "മലയാളം",
    script: "Malayalam",
    nllbCode: "mal_Mlym",
    indicTransCode: "mal_Mlym",
    isScheduled22: true,
  },
  [IndianLanguage.MNI]: {
    code: IndianLanguage.MNI,
    name: "Manipuri",
    nativeName: "মৈতৈলোন্",
    script: "Meitei Mayek / Bengali",
    nllbCode: "mni_Mtei",
    indicTransCode: "mni_Mtei",
    isScheduled22: true,
  },
  [IndianLanguage.MR]: {
    code: IndianLanguage.MR,
    name: "Marathi",
    nativeName: "मराठी",
    script: "Devanagari",
    nllbCode: "mar_Deva",
    indicTransCode: "mar_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.NEP]: {
    code: IndianLanguage.NEP,
    name: "Nepali",
    nativeName: "नेपाली",
    script: "Devanagari",
    nllbCode: "npi_Deva",
    indicTransCode: "npi_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.OR]: {
    code: IndianLanguage.OR,
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    script: "Odia",
    nllbCode: "ory_Orya",
    indicTransCode: "ory_Orya",
    isScheduled22: true,
  },
  [IndianLanguage.PA]: {
    code: IndianLanguage.PA,
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
    nllbCode: "pan_Guru",
    indicTransCode: "pan_Guru",
    isScheduled22: true,
  },
  [IndianLanguage.SAN]: {
    code: IndianLanguage.SAN,
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    script: "Devanagari",
    nllbCode: "san_Deva",
    indicTransCode: "san_Deva",
    isScheduled22: true,
  },
  [IndianLanguage.SAT]: {
    code: IndianLanguage.SAT,
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    script: "Ol Chiki",
    nllbCode: "sat_Olck",
    indicTransCode: "sat_Olck",
    isScheduled22: true,
  },
  [IndianLanguage.SD]: {
    code: IndianLanguage.SD,
    name: "Sindhi",
    nativeName: "سنڌي",
    script: "Perso-Arabic",
    nllbCode: "snd_Arab",
    indicTransCode: "snd_Arab",
    isScheduled22: true,
  },
  [IndianLanguage.TA]: {
    code: IndianLanguage.TA,
    name: "Tamil",
    nativeName: "தமிழ்",
    script: "Tamil",
    nllbCode: "tam_Taml",
    indicTransCode: "tam_Taml",
    isScheduled22: true,
  },
  [IndianLanguage.TE]: {
    code: IndianLanguage.TE,
    name: "Telugu",
    nativeName: "తెలుగు",
    script: "Telugu",
    nllbCode: "tel_Telu",
    indicTransCode: "tel_Telu",
    isScheduled22: true,
  },
  [IndianLanguage.UR]: {
    code: IndianLanguage.UR,
    name: "Urdu",
    nativeName: "اردو",
    script: "Perso-Arabic",
    nllbCode: "urd_Arab",
    indicTransCode: "urd_Arab",
    isScheduled22: true,
  },
};

export const SCHEDULED_22_LANGUAGES = Object.values(SUPPORTED_LANGUAGES).filter(
  (l: any) => l.isScheduled22,
);

export function getLanguageInfo(code: string | IndianLanguage): LanguageInfo {
  const normalized = (code || "").toLowerCase() as IndianLanguage;
  return (
    SUPPORTED_LANGUAGES[normalized] || SUPPORTED_LANGUAGES[IndianLanguage.EN]
  );
}

export function getAllSupportedLanguages(): LanguageInfo[] {
  return Object.values(SUPPORTED_LANGUAGES);
}
