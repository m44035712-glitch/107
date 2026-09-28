import { IndianLanguage, SUPPORTED_LANGUAGES, getLanguageInfo } from '@bis/shared-types';
import { InferenceClient } from '@huggingface/inference';
import { IndicFullTranslator } from '../multilingual/indic-full-translator';

export interface TranslationOptions {
  sourceLang?: IndianLanguage;
  targetLang: IndianLanguage;
  preservedEntities?: string[];
}

export class HuggingFaceTranslationService {
  private cache = new Map<string, string>();
  private maxCacheSize = 500;
  private client: InferenceClient | null = null;
  private token: string | null = null;
  private primaryModel: string;

  constructor() {
    this.token = process.env.HF_TOKEN || null;
    this.primaryModel = process.env.HF_TRANSLATION_MODEL || 'facebook/nllb-200-distilled-600M';

    if (this.token && !this.token.includes('your_huggingface_token_here') && this.token.trim().length > 5) {
      try {
        this.client = new InferenceClient(this.token.trim());
      } catch (err) {
        console.warn('[HuggingFaceTranslationService] Failed to initialize InferenceClient:', err);
      }
    }
  }

  /**
   * Placeholder Protection: Masks standard numbers, clauses, citations, and URLs
   * before sending to machine translation to prevent semantic tampering.
   */
  maskTechnicalEntities(text: string): { maskedText: string; placeholderMap: Map<string, string> } {
    const placeholderMap = new Map<string, string>();
    let counter = 0;

    let masked = text;

    // 1. URLs
    masked = masked.replace(/https?:\/\/[^\s)\]]+/g, (match) => {
      const key = `__URL_${counter++}__`;
      placeholderMap.set(key, match);
      return key;
    });

    // 2. Standard numbers (e.g. IS 17526:2021, IS 10500, IS 1417:2016)
    masked = masked.replace(/\bIS\s*\d+(?::\d{4})?\b/gi, (match) => {
      const key = `__IS_NUM_${counter++}__`;
      placeholderMap.set(key, match);
      return key;
    });

    // 3. Clause references (e.g. Clause 4.1, Clause 5.2.1)
    masked = masked.replace(/\bClause\s*[0-9.]+\b/gi, (match) => {
      const key = `__CLAUSE_${counter++}__`;
      placeholderMap.set(key, match);
      return key;
    });

    // 4. Citation brackets (e.g. [1], [2])
    masked = masked.replace(/\[\d+\]/g, (match) => {
      const key = `__CITE_${counter++}__`;
      placeholderMap.set(key, match);
      return key;
    });

    // 5. CM/L Licence numbers
    masked = masked.replace(/\bCM\/L[- ]?\d{7,8}\b/gi, (match) => {
      const key = `__CML_${counter++}__`;
      placeholderMap.set(key, match);
      return key;
    });

    // 6. 6-digit HUID codes
    masked = masked.replace(/\b[A-Z0-9]{6}\b/g, (match) => {
      // Only mask if mixed alphanumeric
      if (/[A-Z]/.test(match) && /\d/.test(match)) {
        const key = `__HUID_${counter++}__`;
        placeholderMap.set(key, match);
        return key;
      }
      return match;
    });

    return { maskedText: masked, placeholderMap };
  }

  /**
   * Restores all masked technical identifiers back to their exact original characters.
   * Strictly preserves external whitespace, newlines, and markdown formatting.
   */
  unmaskTechnicalEntities(text: string, placeholderMap: Map<string, string>): string {
    let unmasked = text;
    for (const [key, value] of placeholderMap.entries()) {
      // 1. Direct exact replacement
      unmasked = unmasked.split(key).join(value);

      // 2. Safely match potential internal whitespace inserted by MT engines strictly within __...__ boundaries
      const inner = key.replace(/^__/, '').replace(/__$/, '').replace(/_/g, '[_\\s]*');
      const boundedRegex = new RegExp(`__\\s*${inner}\\s*__`, 'gi');
      unmasked = unmasked.replace(boundedRegex, value);
    }
    return unmasked;
  }

  /**
   * Translates English grounded technical answer into target Indian language
   * using Hugging Face API with placeholder protection and resilient local Indic translator.
   */
  async translateAnswer(text: string, targetLang: IndianLanguage): Promise<string> {
    if (!text || text.trim() === '' || targetLang === IndianLanguage.EN) {
      return text;
    }

    const cacheKey = `en:${targetLang}:${text.slice(0, 100)}:${text.length}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const { maskedText, placeholderMap } = this.maskTechnicalEntities(text);
    let translated = '';

    // Step 1: Check IndicFullTranslator for full structured BIS templates
    const localizedTemplate = IndicFullTranslator.translateText(maskedText, targetLang);
    if (localizedTemplate !== maskedText) {
      translated = localizedTemplate;
    }

    // Step 2: Attempt Hugging Face Inference API if client is available and text has remaining English sections
    if ((!translated || translated === maskedText) && this.client && this.token) {
      try {
        const targetInfo = getLanguageInfo(targetLang);
        
        // Split by paragraphs to stay safely within model token boundaries
        const paragraphs = maskedText.split('\n\n');
        const translatedParagraphs: string[] = [];

        for (const p of paragraphs) {
          if (!p.trim()) {
            translatedParagraphs.push('');
            continue;
          }
          
          const pTrans = IndicFullTranslator.translateText(p, targetLang);
          if (pTrans !== p) {
            translatedParagraphs.push(pTrans);
            continue;
          }

          const response = await this.client.translation({
            model: this.primaryModel,
            inputs: p,
            parameters: {
              src_lang: 'eng_Latn',
              tgt_lang: targetInfo.nllbCode
            }
          });

          if (response && response.translation_text) {
            translatedParagraphs.push(response.translation_text);
          } else {
            translatedParagraphs.push(p);
          }
        }

        translated = translatedParagraphs.join('\n\n');
      } catch (err: any) {
        console.warn(`[HuggingFaceTranslationService] HF API call failed for ${targetLang}, using local Indic translator:`, err.message || err);
      }
    }

    // Fallback: If still untranslated, run local translator
    if (!translated) {
      translated = IndicFullTranslator.translateText(maskedText, targetLang);
    }

    // Restore all technical entities, IS codes, clauses, citations, URLs
    const finalResult = this.unmaskTechnicalEntities(translated, placeholderMap);

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, finalResult);

    return finalResult;
  }

  /**
   * Translates non-English Indic query to English search query
   */
  async translateToEnglish(text: string, sourceLang: IndianLanguage): Promise<string> {
    if (!text || text.trim() === '' || sourceLang === IndianLanguage.EN) {
      return text;
    }

    const { maskedText, placeholderMap } = this.maskTechnicalEntities(text);
    let translated = '';

    if (this.client && this.token) {
      try {
        const srcInfo = getLanguageInfo(sourceLang);
        const response = await this.client.translation({
          model: this.primaryModel,
          inputs: maskedText,
          parameters: {
            src_lang: srcInfo.nllbCode,
            tgt_lang: 'eng_Latn'
          }
        });

        if (response && response.translation_text) {
          translated = response.translation_text;
        }
      } catch (err: any) {
        console.warn(`[HuggingFaceTranslationService] HF translateToEnglish failed for ${sourceLang}:`, err.message || err);
      }
    }

    if (!translated) {
      return this.unmaskTechnicalEntities(maskedText, placeholderMap);
    }

    return this.unmaskTechnicalEntities(translated, placeholderMap);
  }
}

export const huggingFaceTranslationService = new HuggingFaceTranslationService();
