import { IndianLanguage } from "@bis/shared-types";

export interface LanguageDetectionResult {
  language: IndianLanguage;
  script: string;
  isHinglish: boolean;
  confidence: number;
}

// Common Hinglish stopwords and markers
const HINGLISH_PATTERNS = [
  /\b(ke\s+liye|keliye)\b/i,
  /\b(kaise|kese)\b/i,
  /\b(kaunsa|konsa|kaun\s+sa|kon\s+sa|kaunse|konse)\b/i,
  /\b(kya|kyaa)\b/i,
  /\b(hai|hain|he|hen)\b/i,
  /\b(hoga|hogi|honge)\b/i,
  /\b(chahiye|chahie)\b/i,
  /\b(batao|batayein|bataiye|bataye)\b/i,
  /\b(karein|kare|karna|karte|karta)\b/i,
  /\b(samjhao|samjhayein|samjhaiye)\b/i,
  /\b(lagta|lagte|lagega|lagegi)\b/i,
  /\b(meri|mera|mere|humara|apna)\b/i,
  /\b(banati|banate|banata|banaata)\b/i,
  /\b(milega|milegi|milti|milta)\b/i,
  /\b(dekhna|dekhne|dekhein)\b/i,
  /\b(janna|jaanna|jaanne)\b/i,
  /\b(sone\s+ka|chandi\s+ka)\b/i,
  /\b(nakli|asli|shuddh)\b/i,
  /\b(zaruri|jaruri|zaroori|zaroorat)\b/i,
  /\b(pramaanit|pramanit)\b/i,
  /\b(kahan|kaha|kidhar)\b/i,
  /\b(mein|me|pe|par)\b/i,
  /\b(aur|ya|tatha)\b/i,
];

export class LanguageDetector {
  private scriptRanges: Array<{
    lang: IndianLanguage;
    script: string;
    regex: RegExp;
    confidence: number;
  }> = [
    {
      lang: IndianLanguage.TA,
      script: "Tamil",
      regex: /[\u0B80-\u0BFF]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.TE,
      script: "Telugu",
      regex: /[\u0C00-\u0C7F]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.KN,
      script: "Kannada",
      regex: /[\u0C80-\u0CFF]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.ML,
      script: "Malayalam",
      regex: /[\u0D00-\u0D7F]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.GU,
      script: "Gujarati",
      regex: /[\u0A80-\u0AFF]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.PA,
      script: "Gurmukhi (Punjabi)",
      regex: /[\u0A00-\u0A7F]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.OR,
      script: "Odia",
      regex: /[\u0B00-\u0B7F]/,
      confidence: 0.98,
    },
    {
      lang: IndianLanguage.BN,
      script: "Bengali",
      regex: /[\u0980-\u09FF]/,
      confidence: 0.96,
    },
    {
      lang: IndianLanguage.AS,
      script: "Assamese",
      regex: /[ৰৱ]/,
      confidence: 0.95,
    },
    {
      lang: IndianLanguage.UR,
      script: "Perso-Arabic (Urdu)",
      regex: /[\u0600-\u06FF]/,
      confidence: 0.95,
    },
    {
      lang: IndianLanguage.SAT,
      script: "Ol Chiki (Santali)",
      regex: /[\u1C50-\u1C7F]/,
      confidence: 0.99,
    },
    {
      lang: IndianLanguage.MNI,
      script: "Meitei Mayek (Manipuri)",
      regex: /[\uABC0-\uABFF]/,
      confidence: 0.99,
    },
    {
      lang: IndianLanguage.HI,
      script: "Devanagari",
      regex: /[\u0900-\u097F]/,
      confidence: 0.95,
    },
  ];

  /**
   * Detect language, script, Hinglish status, and confidence for a given input text.
   */
  async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    if (!text || text.trim() === "") {
      return {
        language: IndianLanguage.EN,
        script: "Latin",
        isHinglish: false,
        confidence: 1.0,
      };
    }

    const trimmed = text.trim();

    // Check non-Latin Indic scripts first
    for (const item of this.scriptRanges) {
      if (item.regex.test(trimmed)) {
        // Special differentiation within Devanagari
        if (item.lang === IndianLanguage.HI) {
          if (/(?:ळ|\bआहे\b|\bनाही\b|\bकाय\b|\bकसे\b|\bकरा\b)/.test(trimmed)) {
            return {
              language: IndianLanguage.MR,
              script: "Devanagari (Marathi)",
              isHinglish: false,
              confidence: 0.92,
            };
          }
          if (/(?:\bहो\b|\bछैन\b|\bगर्ने\b|\bभयो\b)/.test(trimmed)) {
            return {
              language: IndianLanguage.NEP,
              script: "Devanagari (Nepali)",
              isHinglish: false,
              confidence: 0.92,
            };
          }
          if (/(?:\bअस्ति\b|\bभवति\b|\bकिम्\b|\bइति\b)/.test(trimmed)) {
            return {
              language: IndianLanguage.SAN,
              script: "Devanagari (Sanskrit)",
              isHinglish: false,
              confidence: 0.95,
            };
          }
        }

        return {
          language: item.lang,
          script: item.script,
          isHinglish: false,
          confidence: item.confidence,
        };
      }
    }

    // Latin Script Analysis (English vs Hinglish / Romanized Hindi)
    let hinglishMatchCount = 0;
    for (const pattern of HINGLISH_PATTERNS) {
      if (pattern.test(trimmed)) {
        hinglishMatchCount++;
      }
    }

    if (hinglishMatchCount >= 1) {
      // Romanized Hindi queries — treat as Hindi for processing purposes
      const confidence = Math.min(0.7 + hinglishMatchCount * 0.1, 0.98);
      return {
        language: IndianLanguage.HI,
        script: "Latin",
        isHinglish: true,
        confidence,
      };
    }

    return {
      language: IndianLanguage.EN,
      script: "Latin",
      isHinglish: false,
      confidence: 0.98,
    };
  }
}

export const languageDetector = new LanguageDetector();
