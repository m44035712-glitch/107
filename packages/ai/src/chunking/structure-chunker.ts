import { StandardStatus } from '@bis/shared-types';
import * as cheerio from 'cheerio';
import pdfParse from 'pdf-parse';

export interface RawDocumentSection {
  documentTitle: string;
  standardNumber: string;
  sectionTitle?: string;
  clauseNumber: string;
  subclauseNumber?: string;
  pageNumber: number;
  content: string;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
  }>;
  sourceUrl: string;
  version?: string;
  publicationDate: string;
  status: StandardStatus;
}

export interface StructuredChunk {
  chunkIndex: number;
  documentTitle: string;
  standardNumber: string;
  section?: string;
  clause: string;
  subclause?: string;
  page: number;
  content: string;
  metadata: {
    sourceUrl: string;
    version?: string;
    publicationDate: string;
    status: StandardStatus;
    hasTables: boolean;
  };
}

export class StructureAwareDocumentChunker {
  /**
   * Parses raw extracted PDF or HTML text into RawDocumentSection[] by detecting clause numbers,
   * section headers, page numbers, and structural boundaries.
   */
  parseRawTextToSections(
    rawText: string,
    meta: {
      documentTitle: string;
      standardNumber: string;
      sourceUrl: string;
      publicationDate: string;
      status?: StandardStatus;
      version?: string;
    }
  ): RawDocumentSection[] {
    const sections: RawDocumentSection[] = [];
    const status = meta.status || StandardStatus.ACTIVE;

    // Normalize newlines
    const lines = rawText.split(/\r?\n/);
    let currentPage = 1;
    let currentClause = '1.0';
    let currentSectionTitle = 'General';
    let currentBuffer: string[] = [];

    // Regex for Clause detection: e.g. "4.1 General", "Clause 5.2", "12.3.1 Acceptance Criteria"
    const clauseRegex = /^(?:Clause\s+)?(\d+(?:\.\d+)+)\s+([A-Z0-9\s.,\-\(\)]+)/i;
    const pageRegex = /(?:Page|\f)\s*(\d+)/i;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Page tracking
      const pageMatch = trimmed.match(pageRegex);
      if (pageMatch) {
        currentPage = parseInt(pageMatch[1], 10) || currentPage;
        continue;
      }

      // Clause / Section detection
      const clauseMatch = trimmed.match(clauseRegex);
      if (clauseMatch) {
        // Flush existing section buffer
        if (currentBuffer.length > 0) {
          sections.push({
            documentTitle: meta.documentTitle,
            standardNumber: meta.standardNumber,
            sectionTitle: currentSectionTitle,
            clauseNumber: currentClause,
            pageNumber: currentPage,
            content: currentBuffer.join('\n').trim(),
            sourceUrl: meta.sourceUrl,
            version: meta.version,
            publicationDate: meta.publicationDate,
            status
          });
          currentBuffer = [];
        }

        currentClause = clauseMatch[1];
        currentSectionTitle = clauseMatch[2].trim() || 'General';
      }

      currentBuffer.push(trimmed);
    }

    // Flush remaining
    if (currentBuffer.length > 0) {
      sections.push({
        documentTitle: meta.documentTitle,
        standardNumber: meta.standardNumber,
        sectionTitle: currentSectionTitle,
        clauseNumber: currentClause,
        pageNumber: currentPage,
        content: currentBuffer.join('\n').trim(),
        sourceUrl: meta.sourceUrl,
        version: meta.version,
        publicationDate: meta.publicationDate,
        status
      });
    }

    return sections;
  }

  /**
   * Extracts raw text from PDF buffer
   */
  async extractPdfText(pdfBuffer: Buffer): Promise<string> {
    const data = await pdfParse(pdfBuffer);
    return data.text || '';
  }

  /**
   * Extracts raw text and table structures from HTML document string using cheerio
   */
  extractHtmlText(htmlContent: string): string {
    const $ = cheerio.load(htmlContent);

    // Remove scripts and styles
    $('script, style, noscript').remove();

    // Convert tables to markdown string
    $('table').each((_, table) => {
      const headers: string[] = [];
      $(table)
        .find('th')
        .each((_, th) => {
          headers.push($(th).text().trim());
        });

      const rows: string[][] = [];
      $(table)
        .find('tr')
        .each((_, tr) => {
          const row: string[] = [];
          $(tr)
            .find('td')
            .each((_, td) => {
              row.push($(td).text().trim());
            });
          if (row.length > 0) rows.push(row);
        });

      let mdTable = '\n\n';
      if (headers.length > 0) {
        mdTable += `| ${headers.join(' | ')} |\n`;
        mdTable += `| ${headers.map(() => '---').join(' | ')} |\n`;
      }
      for (const r of rows) {
        mdTable += `| ${r.join(' | ')} |\n`;
      }
      mdTable += '\n\n';

      $(table).replaceWith(mdTable);
    });

    return $('body').text() || $.text() || '';
  }

  /**
   * Structure-aware chunking that preserves clause boundaries, tables, and page metadata.
   * Does NOT blindly slice by character length.
   */
  chunkDocument(sections: RawDocumentSection[]): StructuredChunk[] {
    const chunks: StructuredChunk[] = [];
    let chunkIndex = 0;

    for (const sec of sections) {
      // If table exists, format into structured markdown text to preserve relations
      let formattedContent = sec.content.trim();

      if (sec.tables && sec.tables.length > 0) {
        for (const tbl of sec.tables) {
          formattedContent += `\n\n**Table: ${tbl.title}**\n`;
          formattedContent += `| ${tbl.headers.join(' | ')} |\n`;
          formattedContent += `| ${tbl.headers.map(() => '---').join(' | ')} |\n`;
          for (const row of tbl.rows) {
            formattedContent += `| ${row.join(' | ')} |\n`;
          }
        }
      }

      // If content is very long, split along paragraph boundaries preserving clause context
      const paragraphs = formattedContent.split(/\n\s*\n/);
      let currentSubChunk = '';

      for (let p = 0; p < paragraphs.length; p++) {
        const para = paragraphs[p].trim();
        if (!para) continue;

        if ((currentSubChunk + '\n\n' + para).length > 1200 && currentSubChunk.length > 0) {
          chunks.push({
            chunkIndex: chunkIndex++,
            documentTitle: sec.documentTitle,
            standardNumber: sec.standardNumber,
            section: sec.sectionTitle,
            clause: sec.clauseNumber,
            subclause: sec.subclauseNumber,
            page: sec.pageNumber,
            content: `[${sec.standardNumber} Clause ${sec.clauseNumber} - Page ${sec.pageNumber}]\n${currentSubChunk.trim()}`,
            metadata: {
              sourceUrl: sec.sourceUrl,
              version: sec.version,
              publicationDate: sec.publicationDate,
              status: sec.status,
              hasTables: !!(sec.tables && sec.tables.length > 0)
            }
          });
          currentSubChunk = para;
        } else {
          currentSubChunk = currentSubChunk ? `${currentSubChunk}\n\n${para}` : para;
        }
      }

      if (currentSubChunk.trim()) {
        chunks.push({
          chunkIndex: chunkIndex++,
          documentTitle: sec.documentTitle,
          standardNumber: sec.standardNumber,
          section: sec.sectionTitle,
          clause: sec.clauseNumber,
          subclause: sec.subclauseNumber,
          page: sec.pageNumber,
          content: `[${sec.standardNumber} Clause ${sec.clauseNumber} - Page ${sec.pageNumber}]\n${currentSubChunk.trim()}`,
          metadata: {
            sourceUrl: sec.sourceUrl,
            version: sec.version,
            publicationDate: sec.publicationDate,
            status: sec.status,
            hasTables: !!(sec.tables && sec.tables.length > 0)
          }
        });
      }
    }

    return chunks;
  }
}
