import { IndianLanguage, SUPPORTED_LANGUAGES, getLanguageInfo } from '@bis/shared-types';
import { languageDetector, LanguageDetectionResult } from '../multilingual/language-detector';
import { hinglishNormalizer, NormalizationResult } from '../multilingual/hinglish-normalizer';
import { huggingFaceTranslationService, HuggingFaceTranslationService } from './huggingface.provider';

export interface ITranslationProvider {
  detectLanguage(text: string): Promise<IndianLanguage>;
  detectFullLanguage(text: string): Promise<LanguageDetectionResult>;
  normalizeQuery(text: string): Promise<NormalizationResult>;
  translateToEnglish(text: string, sourceLang: IndianLanguage): Promise<{ translatedText: string; preservedEntities: string[] }>;
  translateFromEnglish(text: string, targetLang: IndianLanguage, preservedEntities?: string[]): Promise<string>;
}

/**
 * Indic Language Engine supporting all 22 Eighth-Schedule Indian Languages + English + Hinglish.
 * Backed by Hugging Face API (IndicTrans2/NLLB) with entity placeholder protection,
 * Hinglish semantic normalization, and resilient local fallback.
 */
export class IndicLanguageEngine implements ITranslationProvider {
  private detector = languageDetector;
  private normalizer = hinglishNormalizer;
  private hfService = huggingFaceTranslationService;

  /**
   * Detect language code
   */
  async detectLanguage(text: string): Promise<IndianLanguage> {
    const res = await this.detector.detectLanguage(text);
    return res.language;
  }

  /**
   * Full language detection with script, Hinglish flag, and confidence
   */
  async detectFullLanguage(text: string): Promise<LanguageDetectionResult> {
    return this.detector.detectLanguage(text);
  }

  /**
   * Normalize Hinglish or regional queries into clean semantic English query
   * while strictly extracting and preserving technical entities.
   */
  async normalizeQuery(text: string): Promise<NormalizationResult> {
    const detection = await this.detector.detectLanguage(text);
    return this.normalizer.normalize(text, detection.isHinglish);
  }

  /**
   * Translate input query to canonical English search query
   */
  async translateToEnglish(
    text: string,
    sourceLang: IndianLanguage
  ): Promise<{ translatedText: string; preservedEntities: string[] }> {
    const detection = await this.detector.detectLanguage(text);
    const normalization = this.normalizer.normalize(text, detection.isHinglish);

    if (sourceLang === IndianLanguage.EN && detection.language === IndianLanguage.EN && !detection.isHinglish) {
      return {
        translatedText: text.trim(),
        preservedEntities: normalization.preservedEntities
      };
    }

    if (detection.isHinglish) {
      return {
        translatedText: normalization.normalizedQuery,
        preservedEntities: normalization.preservedEntities
      };
    }

    // Try Hugging Face model if available
    let translated = await this.hfService.translateToEnglish(text, sourceLang);

    // If HF did not change text or offline, perform semantic dictionary translation
    if (translated === text || !translated) {
      translated = text;

      // Map Indic products & concepts to English search terms
      translated = translated
        // Hindi Products & Concepts
        .replace(/स्टें?न?लेस\s*स्टील|स्टेनलेसस्टील/gi, 'stainless steel')
        .replace(/बोतल[ेंों]*|फ्लास्क/gi, 'bottles flasks')
        .replace(/पीने\s*का\s*पानी|पेयजल|पानी|जल/gi, 'drinking water')
        .replace(/सीमेंट/gi, 'Portland cement')
        .replace(/सरिया|टीएमटी|स्टील\s*बार/gi, 'TMT steel bars Fe 500D')
        .replace(/सोना|सोने|स्वर्ण/gi, 'gold')
        .replace(/चांदी/gi, 'silver')
        .replace(/आभूषण|गहने/gi, 'jewellery')
        .replace(/बैटरी|बैटरीज़|सेल/gi, 'lithium secondary batteries')
        .replace(/खिलौने|खिलौना/gi, 'toys safety')
        .replace(/जूते|चप्पल|पादत्राण/gi, 'footwear')
        .replace(/हेलमेट/gi, 'protective helmets')
        .replace(/इलेक्ट्रॉनिक्स/gi, 'electronics CRS')
        .replace(/के\s*लिए|के\s*वास्ते/gi, 'for')

        // Regional languages terms (Bengali, Tamil, Telugu, Marathi, Gujarati, etc.)
        .replace(/বোতল|বোতলের/gi, 'bottles flasks')
        .replace(/ইস্পাত|স্টিল/gi, 'steel')
        .replace(/জল|পানি/gi, 'drinking water')
        .replace(/সোনা|সোনার/gi, 'gold jewellery')
        .replace(/সিমেন্ট/gi, 'cement')
        .replace(/பாட்டில்/gi, 'bottles flasks')
        .replace(/எஃகு/gi, 'steel')
        .replace(/தண்ணீர்/gi, 'drinking water')
        .replace(/தங்கம்/gi, 'gold jewellery')
        .replace(/சிமெண்ட்/gi, 'cement')
        .replace(/சீசா|బాటిల్/gi, 'bottles flasks')
        .replace(/ఉక్కు/gi, 'steel')
        .replace(/నీరు/gi, 'drinking water')
        .replace(/బంగారం/gi, 'gold jewellery')
        .replace(/సిమెంట్/gi, 'cement')
        .replace(/बाटली|बाटल्या/gi, 'bottles flasks')
        .replace(/पोलाद/gi, 'steel')
        .replace(/पाणी/gi, 'drinking water')
        .replace(/सोने/gi, 'gold jewellery')
        .replace(/સિમેન્ટ/gi, 'cement')
        .replace(/બોટલ/gi, 'bottles flasks')
        .replace(/સ્ટીલ/gi, 'steel')
        .replace(/પાણી/gi, 'drinking water')
        .replace(/સોનું/gi, 'gold jewellery')

        // Regulatory Concepts
        .replace(/मानक[ों]*|मानक कोड|স্ট্যান্ডার্ড|தரநிலை|ప్రమాణం/gi, 'Indian Standard specification')
        .replace(/लागू|लागू होता है|लागू होगा|लागू है|প্রযোজ্য|பொருந்தும்|వర్తిస్తుంది/gi, 'applicable to')
        .replace(/प्रमाणन|प्रमाणपत्र|শংসাপত্র|சான்றிதழ்|ధృవీకరణ/gi, 'BIS certification licence')
        .replace(/परीक्षण|जांच|পরীক্ষা|சோதனை|పరీక్ష/gi, 'testing requirements acceptance criteria')
        .replace(/हॉलमार्क|हॉलमार्किंग|হলমার্ক|ஹால்மார்க்|హాల్‌మార్క్/gi, 'gold hallmarking 6-digit HUID code')
        .replace(/अनिवार्य|जरूरी|বাধ্যতামূলক|கட்டாய|తప్పనిసరి/gi, 'mandatory Quality Control Order QCO')
        .replace(/प्रयोगशाला|लैब|ল্যাব|ஆய்வகம்|ప్రయోగశాల/gi, 'recognized testing laboratory')
        .replace(/धारा|खंड|பிரிவு|విభాగం/gi, 'Clause');
    }

    return {
      translatedText: translated,
      preservedEntities: normalization.preservedEntities
    };
  }

  /**
   * Translate grounded BIS response to target language using Hugging Face Translation Service
   * with entity masking protection.
   */
  async translateFromEnglish(
    text: string,
    targetLang: IndianLanguage,
    _preservedEntities?: string[]
  ): Promise<string> {
    if (targetLang === IndianLanguage.EN || !text || text.trim() === '') {
      return text;
    }

    return this.hfService.translateAnswer(text, targetLang);
  }
}

export const indicLanguageEngine = new IndicLanguageEngine();
