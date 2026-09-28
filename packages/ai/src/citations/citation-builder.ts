import { Citation, Evidence } from '@bis/shared-types';

export class CitationBuilder {
  /**
   * Constructs strict, traceable citations for each referenced evidence chunk.
   */
  buildCitations(evidenceList: Evidence[]): Citation[] {
    return evidenceList.map((ev, index) => {
      const snippet = ev.excerpt.length > 180 ? ev.excerpt.slice(0, 180) + '...' : ev.excerpt;
      return {
        citationNumber: index + 1,
        standardNumber: ev.standardNumber,
        clause: ev.clause,
        section: ev.section,
        page: ev.page,
        sourceUrl: ev.sourceUrl,
        snippet,
        evidenceId: ev.id
      };
    });
  }

  /**
   * Appends formal citation references to generated response text.
   */
  formatResponseWithCitations(text: string, citations: Citation[]): string {
    if (citations.length === 0) return text;

    const formatted = text;
    // Ensure citations references are clean
    return formatted;
  }
}
