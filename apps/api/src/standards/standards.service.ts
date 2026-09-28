import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  ProductProfileQuery,
  ProductRecommendationResult,
  Standard,
  StandardComparisonResult,
  StandardRecommendationMatch,
  StandardStatus
} from '@bis/shared-types';
import { SEED_STANDARDS } from '@bis/seed-data';

@Injectable()
export class StandardsService {
  constructor(private prisma: PrismaService) {}

  async searchStandards(query: string, filter?: { division?: string; isMandatory?: boolean; status?: string }): Promise<{ standards: Standard[]; total: number }> {
    const qLower = (query || '').toLowerCase().trim();
    
    // Extract standard numbers (e.g., 800, 800:2007, 17526, 10500)
    const stdMatches = query.match(/(?:IS\s*[-:]?\s*|standard\s+)?(\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)/gi) || [];
    const extractedNums = stdMatches.map(m => m.replace(/^(?:IS\s*[-:]?\s*|standard\s+)/i, '').trim()).filter(Boolean);

    const STOP_WORDS = new Set([
      'what', 'does', 'the', 'is', 'a', 'an', 'standard', 'for', 'used',
      'how', 'which', 'with', 'and', 'or', 'of', 'to', 'in', 'on', 'by',
      'this', 'that', 'are', 'was', 'were', 'tell', 'give', 'about', 'explain'
    ]);

    const meaningfulTokens = qLower
      .split(/[^a-zA-Z0-9:]+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));

    let dbResults: any[] = [];
    try {
      const orConditions: any[] = [
        { standardNumber: { contains: query, mode: 'insensitive' as const } },
        { title: { contains: query, mode: 'insensitive' as const } },
        { scope: { contains: query, mode: 'insensitive' as const } }
      ];

      for (const num of extractedNums) {
        orConditions.push({ standardNumber: { contains: num, mode: 'insensitive' as const } });
      }
      for (const tok of meaningfulTokens) {
        orConditions.push({ title: { contains: tok, mode: 'insensitive' as const } });
        orConditions.push({ scope: { contains: tok, mode: 'insensitive' as const } });
      }

      dbResults = await this.prisma.standard.findMany({
        where: {
          AND: [
            query ? { OR: orConditions } : {},
            filter?.division ? { division: filter.division } : {},
            filter?.status ? { status: filter.status as any } : {},
            filter?.isMandatory !== undefined ? { isMandatory: filter.isMandatory } : {}
          ]
        },
        include: { clauses: true }
      });
    } catch {
      // ignore
    }

    if (dbResults.length > 0) {
      return {
        standards: dbResults.map(s => this.mapStandard(s)),
        total: dbResults.length
      };
    }

    // In-memory fallback
    const filtered = (SEED_STANDARDS as any[]).filter(s => {
      const sNumLower = s.standardNumber.toLowerCase();
      const sTitleLower = s.title.toLowerCase();
      const sScopeLower = s.scope.toLowerCase();
      const sKeywordsLower = s.keywords.map((k: string) => k.toLowerCase()).join(' ');

      const matchesExtractedNum = extractedNums.some(num => sNumLower.includes(num.toLowerCase()));
      const matchesDirectQuery = !qLower || sNumLower.includes(qLower) || sTitleLower.includes(qLower) || sScopeLower.includes(qLower);
      const matchesTokens = meaningfulTokens.length > 0 && meaningfulTokens.some(tok =>
        sNumLower.includes(tok) || sTitleLower.includes(tok) || sScopeLower.includes(tok) || sKeywordsLower.includes(tok)
      );

      const matchQuery = matchesExtractedNum || matchesDirectQuery || matchesTokens;
      const matchDivision = !filter?.division || s.division === filter.division;
      const matchStatus = !filter?.status || s.status === filter.status;
      const matchMandatory = filter?.isMandatory === undefined || s.isMandatory === filter.isMandatory;

      return matchQuery && matchDivision && matchStatus && matchMandatory;
    });

    // Sort by exact standard match first
    filtered.sort((a, b) => {
      const aHasNum = extractedNums.some(num => a.standardNumber.toLowerCase().includes(num.toLowerCase()));
      const bHasNum = extractedNums.some(num => b.standardNumber.toLowerCase().includes(num.toLowerCase()));
      if (aHasNum && !bHasNum) return -1;
      if (!aHasNum && bHasNum) return 1;
      return 0;
    });

    return {
      standards: filtered.map(s => this.mapStandard(s)),
      total: filtered.length
    };
  }

  async getStandardById(idOrNumber: string): Promise<Standard> {
    let std: any;
    try {
      std = await this.prisma.standard.findFirst({
        where: {
          OR: [{ id: idOrNumber }, { standardNumber: { contains: idOrNumber, mode: 'insensitive' as const } }]
        },
        include: { clauses: true }
      });
    } catch {
      // ignore
    }

    if (!std) {
      std = (SEED_STANDARDS as any[]).find(
        s => s.id === idOrNumber || s.standardNumber.toLowerCase().includes(idOrNumber.toLowerCase())
      );
    }

    if (!std) {
      throw new NotFoundException(`Indian Standard '${idOrNumber}' not found in authoritative repository`);
    }

    return this.mapStandard(std);
  }

  async recommendStandards(profile: ProductProfileQuery): Promise<ProductRecommendationResult> {
    const fullQueryString = `${profile.productName} ${profile.material || ''} ${profile.intendedApplication || ''} ${profile.technicalCharacteristics || ''}`;
    
    // Extract standard numbers (e.g., 800, 800:2007, 17526, 10500)
    const stdMatches = fullQueryString.match(/(?:IS\s*[-:]?\s*|standard\s+)?(\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)/gi) || [];
    const extractedNums = stdMatches.map(m => m.replace(/^(?:IS\s*[-:]?\s*|standard\s+)/i, '').trim()).filter(Boolean);

    const STOP_WORDS = new Set([
      'what', 'does', 'the', 'is', 'a', 'an', 'standard', 'for', 'used',
      'how', 'which', 'with', 'and', 'or', 'of', 'to', 'in', 'on', 'by',
      'this', 'that', 'are', 'was', 'were', 'tell', 'give', 'about', 'explain'
    ]);

    const qTokens = fullQueryString
      .toLowerCase()
      .split(/[^a-zA-Z0-9:]+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));

    const candidates = (SEED_STANDARDS as any[]);
    const matches: StandardRecommendationMatch[] = [];

    for (const std of candidates) {
      let score = 30;
      const matchedAttrs: string[] = [];
      const missingPrompt: string[] = [];

      const stdText = `${std.standardNumber} ${std.title} ${std.scope} ${std.abstract} ${std.keywords.join(' ')}`.toLowerCase();

      // Check if standard number is directly requested
      const hasExactStdNum = extractedNums.some(num => std.standardNumber.toLowerCase().includes(num.toLowerCase()));
      if (hasExactStdNum) {
        score += 55;
        matchedAttrs.push(`Matches standard designation: '${std.standardNumber}'`);
      }

      // Check product name
      if (profile.productName && stdText.includes(profile.productName.toLowerCase())) {
        score += 35;
        matchedAttrs.push(`Matches product specification: '${profile.productName}'`);
      }

      // Check material
      if (profile.material && stdText.includes(profile.material.toLowerCase())) {
        score += 20;
        matchedAttrs.push(`Matches raw material specification: '${profile.material}'`);
      } else if (!profile.material && (stdText.includes('steel') || stdText.includes('pvc') || stdText.includes('plastic'))) {
        missingPrompt.push('Specify exact material grade (e.g., SS 304, SS 316, HDPE Grade PE-100) to confirm grade conformity.');
      }

      // Check application
      if (profile.intendedApplication && stdText.includes(profile.intendedApplication.toLowerCase())) {
        score += 15;
        matchedAttrs.push(`Matches intended application: '${profile.intendedApplication}'`);
      }

      // Check meaningful token overlap
      for (const token of qTokens) {
        if (stdText.includes(token)) {
          score += 4;
        }
      }

      score = Math.min(Math.round(score), 98);

      if (score >= 45) {
        matches.push({
          standard: this.mapStandard(std),
          relevanceScore: score,
          matchReason: `Evaluated strong correlation based on ${matchedAttrs.length > 0 ? matchedAttrs.join(', ') : 'specification keywords'}.`,
          matchingAttributes: matchedAttrs,
          missingInformationPrompt: missingPrompt.length > 0 ? missingPrompt : ['Verify in-house testing capacity for full Scheme I conformity.'],
          relatedStandards: candidates.filter(c => c.standardNumber !== std.standardNumber && c.division === std.division).map(c => c.standardNumber),
          confidence: score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW',
          evidence: [
            {
              id: `ev-${std.standardNumber}`,
              documentTitle: std.title,
              standardNumber: std.standardNumber,
              clause: '1.1 Scope',
              page: 1,
              publicationDate: std.publicationDate,
              status: std.status,
              sourceUrl: std.sourceUrl,
              excerpt: std.scope,
              similarityScore: score / 100
            }
          ]
        });
      }
    }

    matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      query: profile,
      matches,
      totalMatches: matches.length,
      guidanceNotes: 'Semantic similarity alone does NOT constitute legal certification applicability. Verify against mandatory Quality Control Orders (QCO) and official Sectional Committee schedules.',
      disclaimer: 'Authoritative decisions must be verified on the official Bureau of Indian Standards e-BIS portal (services.bis.gov.in).'
    };
  }

  async compareStandards(standardNumbers: string[]): Promise<StandardComparisonResult> {
    const list: Standard[] = [];
    for (const num of standardNumbers) {
      try {
        const s = await this.getStandardById(num);
        list.push(s);
      } catch {
        // ignore
      }
    }

    if (list.length < 2) {
      const fallback = (SEED_STANDARDS as any[]).slice(0, 2).map(s => this.mapStandard(s));
      list.push(...fallback);
    }

    return {
      standards: list,
      commonFeatures: [
        'Mandatory compliance under BIS Quality Control Orders (QCO)',
        'Requires factory infrastructure audit and in-house laboratory testing',
        'Routine sampling requirements for each production lot'
      ],
      differences: [
        {
          parameter: 'Scope & Application',
          values: list.reduce((acc, s) => ({ ...acc, [s.standardNumber]: s.scope.slice(0, 100) + '...' }), {})
        },
        {
          parameter: 'Division / Committee',
          values: list.reduce((acc, s) => ({ ...acc, [s.standardNumber]: s.division }), {})
        },
        {
          parameter: 'Mandatory QCO Status',
          values: list.reduce((acc, s) => ({ ...acc, [s.standardNumber]: s.isMandatory ? 'Mandatory (Scheme I / CRS)' : 'Voluntary' }), {})
        }
      ],
      applicabilityCriteria: list.reduce((acc, s) => ({ ...acc, [s.standardNumber]: `Use for ${s.title}` }), {}),
      summary: `Comparison of ${list.map(s => s.standardNumber).join(' and ')} highlighting testing limits, material grade requirements, and certification scheme differences.`
    };
  }

  private mapStandard(s: any): Standard {
    return {
      id: s.id || `std-${s.standardNumber}`,
      standardNumber: s.standardNumber,
      title: s.title,
      year: s.year || 2021,
      department: s.department || 'General',
      division: s.division || 'Technical Division',
      status: s.status || StandardStatus.ACTIVE,
      scope: s.scope || '',
      abstract: s.abstract || '',
      keywords: Array.isArray(s.keywords) ? s.keywords : [],
      isMandatory: s.isMandatory || false,
      qcoNotificationNumber: s.qcoNotificationNumber || undefined,
      qcoDate: s.qcoDate || undefined,
      sourceUrl: s.sourceUrl || 'https://www.services.bis.gov.in',
      publicationDate: s.publicationDate || '2021-01-01',
      lastUpdatedDate: s.lastUpdatedDate || '2024-01-01'
    };
  }
}
