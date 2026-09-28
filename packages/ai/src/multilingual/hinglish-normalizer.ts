import { BIS_TERMINOLOGY_DICTIONARY } from './bis-terminology-dictionary';

export interface NormalizationResult {
  normalizedQuery: string;
  originalQuery: string;
  isHinglish: boolean;
  preservedEntities: string[];
}

export class HinglishNormalizer {
  /**
   * Extract technical BIS entities from raw input query
   */
  extractTechnicalEntities(text: string): string[] {
    const isPattern = /\bIS\s*[-:]?\s*(\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)\b/gi;
    const stdWordPattern = /\bstandard\s+([A-Z]*\s*\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)\b/gi;
    const numYearPattern = /\b(\d{2,5}:\d{4})\b/g;
    const clausePattern = /\bClause\s*[0-9.]+\b/gi;
    const huidPattern = /\b[A-Z0-9]{6}\b/g;
    const cmlPattern = /\bCM\/L[- ]?\d{7,8}\b/gi;
    const qcoPattern = /\bQCO\b/gi;
    const standardKeywords = /\b(ISI|CRS|FMCS|ECO|TMT|SS\s*304|SS\s*316|BEE)\b/gi;

    const entities: string[] = [];

    // 1. IS prefix matches
    let match: RegExpExecArray | null;
    while ((match = isPattern.exec(text)) !== null) {
      entities.push(match[0].trim());
      const bareNum = match[1].trim();
      entities.push(bareNum);
      if (!match[0].toUpperCase().startsWith('IS ')) {
        entities.push(`IS ${bareNum}`);
      }
    }

    // 2. "standard <num>" matches
    while ((match = stdWordPattern.exec(text)) !== null) {
      const numPart = match[1].replace(/^IS\s*/i, '').trim();
      if (/\d/.test(numPart)) {
        entities.push(`IS ${numPart}`);
        entities.push(numPart);
      }
    }

    // 3. Standalone "<num>:<year>" matches (e.g. 800:2007, 17526:2021)
    while ((match = numYearPattern.exec(text)) !== null) {
      entities.push(match[1]);
      entities.push(`IS ${match[1]}`);
      const bareNumOnly = match[1].split(':')[0];
      if (bareNumOnly) {
        entities.push(`IS ${bareNumOnly}`);
        entities.push(bareNumOnly);
      }
    }

    const clauseMatches = text.match(clausePattern) || [];
    const cmlMatches = text.match(cmlPattern) || [];
    const qcoMatches = text.match(qcoPattern) || [];
    const keywordMatches = text.match(standardKeywords) || [];

    // Filter potential 6-character words from generic text vs actual HUIDs
    const potentialHuids = (text.match(huidPattern) || []).filter(h =>
      /\d/.test(h) && /[A-Z]/.test(h) && !h.startsWith('IS')
    );

    entities.push(...clauseMatches, ...cmlMatches, ...qcoMatches, ...keywordMatches, ...potentialHuids);
    return Array.from(new Set(entities.filter(Boolean)));
  }

  /**
   * Normalize Hinglish or Romanized Hindi queries into semantic English search query
   * while strictly preserving technical entities.
   */
  normalize(query: string, isHinglish: boolean): NormalizationResult {
    const preservedEntities = this.extractTechnicalEntities(query);

    if (!isHinglish) {
      return {
        normalizedQuery: query.trim(),
        originalQuery: query,
        isHinglish: false,
        preservedEntities
      };
    }

    let q = query.trim();

    // 1. Common Hinglish Question Structure Normalizations
    const replacements: Array<[RegExp, string]> = [
      // Standard queries
      [/(?:ke\s+liye|keliye)\s+(?:kaunsa|konsa|kaun\s+sa|kon\s+sa)\s+(?:bis\s+)?standard\s+(?:lagega|lagta\s+hai|hoga|hota\s+hai)/gi, 'which BIS standard applies to'],
      [/(?:meri|hamari|apni)\s+company\s+(.*?)\s+(?:banati|banate|produce\s+karti)\s+hai[,\s]+(?:kaunsa|konsa)\s+standard\s+applicable\s+hai/gi, 'which Indian standard applies to $1'],
      [/(?:kaunsa|konsa|kaun\s+sa)\s+standard\s+(?:applicable\s+hai|lagta\s+hai|lagega)/gi, 'which Indian standard applies'],
      
      // Certification / Mandatory queries
      [/(?:bis\s+)?certification\s+(?:compulsory|mandatory|zaruri|jaruri)\s+hai\s+kya/gi, 'is BIS certification mandatory'],
      [/(?:kaise|kese)\s+(?:milega|prapt\s+karein|apply\s+karein)/gi, 'how to get and apply for'],
      [/(?:process|roadmap)\s+kya\s+hai/gi, 'what is the certification process and roadmap'],
      
      // Hallmarking queries
      [/(?:gold|sone\s+ka)\s+hallmark\s+(?:kaise|kese)\s+(?:verify|check|janch)\s+karein?/gi, 'how to verify gold hallmark with 6-digit HUID code'],
      [/(?:huid|hallmark)\s+(?:kaise\s+check\s+kare|kaise\s+verify\s+kare)/gi, 'how to verify 6-digit HUID hallmark code'],
      
      // Testing queries
      [/(?:is\s+product\s+ke\s+liye\s+)?kaunse\s+tests\s+(?:required|zaruri)\s+hain?/gi, 'what tests and acceptance criteria are required for'],
      [/(?:kaun\s+kaun\s+se|kaunse)\s+test\s+(?:hote\s+hain|hoge|karne\s+padenge)/gi, 'what routine and type tests are required'],
      [/(?:kahan|kidhar)\s+testing\s+(?:hogi|karwayein)/gi, 'where is the recognized testing laboratory located'],
      
      // Clause explanation queries
      [/(?:ka\s+requirement|ki\s+requirement|ko)\s+simple\s+(?:language|hindi|words)\s+mein\s+(?:samjhao|explain\s+karo|batao)/gi, 'explain requirements in simple language'],
      [/simple\s+(?:language|hindi)\s+mein\s+(?:samjhao|explain\s+karo)/gi, 'explain in simple plain language'],
      
      // General Hinglish filler words
      [/\b(ke\s+liye|keliye)\b/gi, 'for'],
      [/\b(ka|ki|ke)\b/gi, 'of'],
      [/\b(aur)\b/gi, 'and'],
      [/\b(ya)\b/gi, 'or'],
      [/\b(mein|me)\b/gi, 'in'],
      [/\b(kya\s+hai|kya\s+hota\s+hai)\b/gi, 'what is'],
      [/\b(batao|batayein|bataiye)\b/gi, 'tell me']
    ];

    for (const [pattern, replacement] of replacements) {
      q = q.replace(pattern, replacement);
    }

    // Clean up excessive whitespace
    q = q.replace(/\s+/g, ' ').trim();

    return {
      normalizedQuery: q,
      originalQuery: query,
      isHinglish: true,
      preservedEntities
    };
  }
}

export const hinglishNormalizer = new HinglishNormalizer();
