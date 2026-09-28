import { PrismaClient } from '@prisma/client';
import { StructureAwareDocumentChunker, getEmbeddingProvider } from '../../packages/ai/src';
import { StandardStatus } from '@bis/shared-types';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const chunker = new StructureAwareDocumentChunker();
const embedder = getEmbeddingProvider();

async function runIngestionBatch() {
  console.log('🚀 Starting BIS Document Ingestion Batch Pipeline...');

  // Sample raw BIS standard text if no file argument provided
  const sampleText = `
IS 10500:2012 DRINKING WATER - SPECIFICATION
Clause 4.1 Physical Requirements
Drinking water shall be clear, colorless, and free from undesirable odor or taste. Turbidity shall not exceed 1.0 NTU (acceptable limit) or 5.0 NTU (permissible limit in absence of alternate source).

Clause 4.2 Chemical Requirements
pH value shall be between 6.5 and 8.5. Total dissolved solids (TDS) shall not exceed 500 mg/L (acceptable limit) or 2000 mg/L (permissible limit).

Clause 4.3 Microbiological Requirements
E. coli or thermotolerant coliform bacteria shall not be detectable in any 100 ml sample of drinking water.

IS 1417:2016 GOLD AND GOLD ALLOYS FINENESS AND MARKING
Clause 6.1 Fineness Grades
Gold jewellery or artefacts shall be marked with fineness grades: 24K (999), 22K (916), 18K (750), or 14K (585).

Clause 6.2 Mandatory Hallmarks
The mandatory hallmarks shall consist of three symbols: BIS Standard Mark (logo), Purity/Fineness grade, and 6-digit alphanumeric HUID.
`;

  const rawFilePath = process.argv[2];
  let content = sampleText;
  let fileType: 'pdf' | 'html' | 'text' = 'text';

  if (rawFilePath && fs.existsSync(rawFilePath)) {
    console.log(`Reading source document from: ${rawFilePath}`);
    const ext = path.extname(rawFilePath).toLowerCase();
    if (ext === '.pdf') {
      fileType = 'pdf';
      const buf = fs.readFileSync(rawFilePath);
      content = await chunker.extractPdfText(buf);
    } else if (ext === '.html' || ext === '.htm') {
      fileType = 'html';
      const rawHtml = fs.readFileSync(rawFilePath, 'utf-8');
      content = chunker.extractHtmlText(rawHtml);
    } else {
      content = fs.readFileSync(rawFilePath, 'utf-8');
    }
  } else {
    console.log('No file path provided. Ingesting baseline authoritative BIS sample documents...');
  }

  const sections = chunker.parseRawTextToSections(content, {
    documentTitle: 'Official BIS Indian Standard Publication',
    standardNumber: 'IS 10500:2012',
    sourceUrl: 'https://www.services.bis.gov.in',
    publicationDate: '2012-05-01',
    status: StandardStatus.ACTIVE
  });

  const chunks = chunker.chunkDocument(sections);
  console.log(`Parsed ${sections.length} sections into ${chunks.length} structured clause chunks.`);

  // Store parent Document
  const docId = randomUUID();
  const doc = await prisma.document.create({
    data: {
      id: docId,
      title: 'Official BIS Indian Standard Publication',
      standardNumber: 'IS 10500:2012',
      category: 'STANDARD',
      division: 'Chemical',
      sourceUrl: 'https://www.services.bis.gov.in',
      publicationDate: '2012-05-01',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      status: StandardStatus.ACTIVE,
      isIngested: true
    }
  });

  let count = 0;
  for (const ch of chunks) {
    const vector = await embedder.embedText(ch.content);
    const vecStr = `[${vector.join(',')}]`;
    const chunkId = randomUUID();

    try {
      await prisma.$executeRaw`
        INSERT INTO document_chunks (
          "id", "documentId", "standardNumber", "section", "clause", "subclause", "page", "content", "vectorEmbedding", "metadata", "status", "createdAt"
        ) VALUES (
          ${chunkId},
          ${doc.id},
          ${ch.standardNumber},
          ${ch.section || null},
          ${ch.clause},
          ${ch.subclause || null},
          ${ch.page},
          ${ch.content},
          ${vecStr}::vector,
          ${JSON.stringify(ch.metadata)}::jsonb,
          'ACTIVE'::"StandardStatus",
          NOW()
        );
      `;
      count++;
    } catch {
      await prisma.documentChunk.create({
        data: {
          id: chunkId,
          documentId: doc.id,
          standardNumber: ch.standardNumber,
          section: ch.section || undefined,
          clause: ch.clause,
          subclause: ch.subclause || undefined,
          page: ch.page,
          content: ch.content,
          metadata: ch.metadata as any,
          status: StandardStatus.ACTIVE
        }
      });
      count++;
    }
  }

  console.log(`✅ Ingestion pipeline finished! Ingested ${count} chunks for Document ${doc.id}`);
  await prisma.$disconnect();
}

runIngestionBatch().catch(async (err) => {
  console.error('❌ Ingestion pipeline failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
