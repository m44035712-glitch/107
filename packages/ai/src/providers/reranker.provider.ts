import { Evidence, QueryIntent, StandardStatus } from '@bis/shared-types';

export interface IRerankerProvider {
  name: string;
  rerank(query: string, intent: QueryIntent, candidates: Evidence[]): Promise<Evidence[]>;
}

export class HybridBISCrossReranker implements IRerankerProvider {
  name = 'hybrid-bis-cross-reranker';

  async rerank(query: string, intent: QueryIntent, candidates: Evidence[]): Promise<Evidence[]> {
    if (!candidates || candidates.length === 0) return [];

    const queryLower = query.toLowerCase();
    
    // Extract standard numbers in various formats: "IS 800", "standard 800:2007", "800:2007", "800"
    const standardPatterns = [
      /\bIS\s*[-:]?\s*(\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)\b/gi,
      /\bstandard\s+([A-Z]*\s*\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)\b/gi,
      /\b(\d{2,5}:\d{4})\b/g,
      /\b(\d{3,5})\b/g
    ];

    const detectedNumbers: string[] = [];
    for (const pattern of standardPatterns) {
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(query)) !== null) {
        const cleaned = m[1] ? m[1].replace(/^IS\s*/i, '').trim() : m[0].replace(/^IS\s*/i, '').trim();
        if (cleaned && /\d/.test(cleaned)) {
          detectedNumbers.push(cleaned.toUpperCase());
          detectedNumbers.push(`IS ${cleaned.toUpperCase()}`);
        }
      }
    }

    const clauseMatches = query.match(/clause\s*([0-9.]+)/i);
    const targetClause = clauseMatches ? clauseMatches[1] : null;

    const STOP_WORDS = new Set([
      'what', 'does', 'the', 'is', 'a', 'an', 'standard', 'for', 'used',
      'how', 'which', 'with', 'and', 'or', 'of', 'to', 'in', 'on', 'by',
      'this', 'that', 'are', 'was', 'were', 'tell', 'give', 'about', 'explain'
    ]);

    const queryTokens = queryLower
      .split(/[^a-zA-Z0-9:]+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));

    const scored = candidates.map(candidate => {
      let score = candidate.similarityScore * 100; // base score 0-100

      // 1. Exact Standard Match Boost (+50 points)
      const candStdUpper = candidate.standardNumber.toUpperCase();
      const candTitleUpper = candidate.documentTitle.toUpperCase();
      
      const hasExactStd = detectedNumbers.some(std => 
        candStdUpper.includes(std) || candTitleUpper.includes(std)
      );
      if (hasExactStd) {
        score += 50;
      }

      // 2. Exact Clause Match Boost (+25 points)
      if (targetClause && candidate.clause && candidate.clause.includes(targetClause)) {
        score += 25;
      }

      // 3. Meaningful Keyword Overlap (+15 points, ignoring stop words)
      const excerptLower = candidate.excerpt.toLowerCase();
      const titleLower = candidate.documentTitle.toLowerCase();
      let matchCount = 0;
      for (const token of queryTokens) {
        if (excerptLower.includes(token) || titleLower.includes(token)) {
          matchCount++;
        }
      }
      score += Math.min(matchCount * 5, 25);

      // 4. Intent Specific Boost
      if (intent === QueryIntent.TESTING_REQUIREMENTS && (excerptLower.includes('test') || excerptLower.includes('sampling'))) {
        score += 15;
      }
      if (intent === QueryIntent.CERTIFICATION_GUIDANCE && (excerptLower.includes('scheme') || excerptLower.includes('licence') || excerptLower.includes('isi'))) {
        score += 15;
      }
      if (intent === QueryIntent.HALLMARKING_VERIFICATION && (candStdUpper.includes('1417') || candStdUpper.includes('2112') || excerptLower.includes('huid'))) {
        score += 30;
      }

      // 5. Freshness / Status Adjustments
      if (candidate.status === StandardStatus.OUTDATED) {
        score -= 20;
      } else if (candidate.status === StandardStatus.ACTIVE) {
        score += 5;
      }

      return {
        ...candidate,
        rerankScore: Math.round(score * 10) / 10
      };
    });

    // Sort descending by rerankScore
    scored.sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0));
    return scored;
  }
}
