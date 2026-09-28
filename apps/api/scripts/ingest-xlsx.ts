import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { createHash, randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { getEmbeddingProvider } from '../../../packages/ai/src';
import { StandardStatus } from '@bis/shared-types';

type CellValue = string | number | boolean | Date | null | undefined;
type Row = Record<string, CellValue>;

const prisma = new PrismaClient();
const embedder = getEmbeddingProvider();
const sourceUrl = 'https://www.bis.gov.in/know-your-standard/?lang=en';
const metadataSheets = new Set(['README']);

function cleanValue(value: CellValue): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function chunkText(text: string, maxWords = 700, overlapWords = 80): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return [text];

  const chunks: string[] = [];
  const step = Math.max(1, maxWords - overlapWords);
  for (let start = 0; start < words.length; start += step) {
    chunks.push(words.slice(start, start + maxWords).join(' '));
    if (start + maxWords >= words.length) break;
  }
  return chunks;
}

function getField(row: Row, predicate: (header: string) => boolean): string | undefined {
  const match = Object.entries(row).find(([header, value]) => predicate(header.toLowerCase()) && cleanValue(value));
  return match ? cleanValue(match[1]) : undefined;
}

function rowToDocument(row: Row, sheet: string, rowNumber: number, sourceFile: string): { text: string; metadata: Record<string, unknown> } {
  const fields = Object.entries(row)
    .map(([header, value]) => [header.trim(), cleanValue(value)] as const)
    .filter(([, value]) => value.length > 0);

  const text = fields.map(([header, value]) => `${header}: ${value}`).join('\n');
  const standard = getField(row, (header) => /^(is number|standard number|standard|is no)/i.test(header));
  const product = getField(row, (header) => /product|title/i.test(header));
  const category = getField(row, (header) => /category|division|sector/i.test(header));
  const rowSource = getField(row, (header) => /source|url|link/i.test(header));

  return {
    text,
    metadata: {
      source: path.basename(sourceFile),
      sourceFile,
      sheet,
      row: rowNumber,
      product: product || null,
      standard: standard || null,
      category: category || null,
      sourceUrl: rowSource || sourceUrl
    }
  };
}

function stableId(sheet: string, row: number, chunk: number, text: string): string {
  return createHash('sha256').update(`${sheet}:${row}:${chunk}:${text}`).digest('hex').slice(0, 32);
}

async function ingestSheet(workbook: XLSX.WorkBook, sheet: string, sourceFile: string): Promise<{ rows: number; documents: number; chunks: number; vectors: number }> {
  const worksheet = workbook.Sheets[sheet];
  const matrix = XLSX.utils.sheet_to_json<CellValue[]>(worksheet, { header: 1, defval: '', raw: false });
  const rawHeaders = matrix[0] || [];
  const headers = rawHeaders.map((header, index) => cleanValue(header) || `Column ${index + 1}`);
  const rows: Array<{ rowNumber: number; row: Row }> = [];

  for (let index = 1; index < matrix.length; index += 1) {
    const row = Object.fromEntries(headers.map((header, column) => [header, matrix[index][column] ?? ''])) as Row;
    if (Object.values(row).some((value) => cleanValue(value))) rows.push({ rowNumber: index + 1, row });
  }

  if (rows.length === 0) return { rows: 0, documents: 0, chunks: 0, vectors: 0 };

  const title = `BIS Dataset - ${sheet}`;
  const previousDocuments = await prisma.document.findMany({ where: { title }, select: { id: true } });
  if (previousDocuments.length > 0) {
    const previousDocumentIds = previousDocuments.map(({ id }) => id);
    await prisma.documentChunk.deleteMany({ where: { documentId: { in: previousDocumentIds } } });
    await prisma.document.deleteMany({ where: { id: { in: previousDocumentIds } } });
  }
  const document = await prisma.document.create({
    data: {
      id: randomUUID(),
      title,
      category: 'BIS_DATASET',
      division: sheet,
      sourceUrl,
      publicationDate: new Date().toISOString().slice(0, 10),
      lastUpdatedDate: new Date().toISOString().slice(0, 10),
      status: StandardStatus.ACTIVE,
      isIngested: true
    }
  });

  let chunksCreated = 0;
  let vectorsStored = 0;
  for (const item of rows) {
    const documentRow = rowToDocument(item.row, sheet, item.rowNumber, sourceFile);
    for (const [chunkIndex, content] of chunkText(documentRow.text).entries()) {
      const id = stableId(sheet, item.rowNumber, chunkIndex, content);
      const metadata = { ...documentRow.metadata, chunk: chunkIndex + 1 };
      const standardNumber = String(documentRow.metadata.standard || 'UNSPECIFIED');
      const vector = await embedder.embedText(content);
      const vectorString = `[${vector.join(',')}]`;

      try {
        await prisma.$executeRaw`
          INSERT INTO document_chunks (
            "id", "documentId", "standardNumber", "section", "clause", "subclause", "page", "content", "vectorEmbedding", "metadata", "status", "createdAt"
          ) VALUES (
            ${id}, ${document.id}, ${standardNumber}, ${sheet}, ${`row-${item.rowNumber}`}, ${`chunk-${chunkIndex + 1}`}, 1,
            ${content}, ${vectorString}::vector, ${JSON.stringify(metadata)}::jsonb, 'ACTIVE'::"StandardStatus", NOW()
          )
          ON CONFLICT ("id") DO NOTHING;
        `;
        vectorsStored += 1;
      } catch {
        await prisma.documentChunk.create({
          data: {
            id,
            documentId: document.id,
            standardNumber,
            section: sheet,
            clause: `row-${item.rowNumber}`,
            subclause: `chunk-${chunkIndex + 1}`,
            page: 1,
            content,
            metadata,
            status: StandardStatus.ACTIVE
          }
        });
      }
      chunksCreated += 1;
    }
  }

  return { rows: rows.length, documents: rows.length, chunks: chunksCreated, vectors: vectorsStored };
}

async function main() {
  const defaultPath = path.resolve(__dirname, '../../../data/bis_dataset.xlsx');
  const workbookPath = process.argv[2] || process.env.BIS_XLSX_PATH || defaultPath;
  if (!fs.existsSync(workbookPath)) throw new Error(`BIS XLSX file not found: ${workbookPath}`);

  console.log('BIS XLSX ingestion started...');
  const workbook = XLSX.readFile(workbookPath, { cellDates: false });
  console.log(`Sheets found: ${workbook.SheetNames.length}`);

  const totals = { rows: 0, documents: 0, chunks: 0, vectors: 0 };
  for (const sheet of workbook.SheetNames) {
    if (metadataSheets.has(sheet)) {
      console.log(`Skipping non-knowledge sheet: ${sheet}`);
      continue;
    }
    const result = await ingestSheet(workbook, sheet, workbookPath);
    totals.rows += result.rows;
    totals.documents += result.documents;
    totals.chunks += result.chunks;
    totals.vectors += result.vectors;
    console.log(`${sheet}: ${result.rows} rows, ${result.chunks} chunks`);
  }

  console.log(`Rows processed: ${totals.rows}`);
  console.log(`Documents created: ${totals.documents}`);
  console.log(`Chunks created: ${totals.chunks}`);
  console.log(`Vectors stored: ${totals.vectors}`);
  console.log('BIS knowledge base created successfully.');
}

main()
  .catch((error) => {
    console.error('BIS XLSX ingestion failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
