import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { StructureAwareDocumentChunker, getEmbeddingProvider } from '@bis/ai';
import { StandardStatus } from '@bis/shared-types';
import { randomUUID } from 'crypto';

export class IngestDocumentDto {
  title!: string;
  standardNumber!: string;
  sourceUrl?: string;
  publicationDate?: string;
  status?: StandardStatus;
  category?: string;
  division?: string;
}

@Injectable()
export class DocumentsService {
  private logger = new Logger(DocumentsService.name);
  private chunker = new StructureAwareDocumentChunker();
  private embedder = getEmbeddingProvider();

  constructor(private prisma: PrismaService) {}

  async ingestDocument(
    fileBuffer: Buffer | string,
    fileType: 'pdf' | 'html' | 'text',
    meta: IngestDocumentDto
  ) {
    this.logger.log(`Starting ingestion for document: ${meta.title} (${meta.standardNumber})`);

    // 1. Extract raw text based on file format
    let rawText = '';
    if (fileType === 'pdf' && Buffer.isBuffer(fileBuffer)) {
      rawText = await this.chunker.extractPdfText(fileBuffer);
    } else if (fileType === 'html') {
      const htmlStr = Buffer.isBuffer(fileBuffer) ? fileBuffer.toString('utf-8') : fileBuffer;
      rawText = this.chunker.extractHtmlText(htmlStr);
    } else {
      rawText = Buffer.isBuffer(fileBuffer) ? fileBuffer.toString('utf-8') : String(fileBuffer);
    }

    if (!rawText || rawText.trim() === '') {
      throw new Error('Failed to extract text from document content');
    }

    // 2. Parse sections with clause numbers and page tracking
    const sections = this.chunker.parseRawTextToSections(rawText, {
      documentTitle: meta.title,
      standardNumber: meta.standardNumber,
      sourceUrl: meta.sourceUrl || 'https://www.services.bis.gov.in',
      publicationDate: meta.publicationDate || new Date().toISOString().split('T')[0],
      status: meta.status || StandardStatus.ACTIVE
    });

    // 3. Structure-aware chunking preserving clause boundaries
    const chunks = this.chunker.chunkDocument(sections);
    this.logger.log(`Generated ${chunks.length} structured chunks for ${meta.standardNumber}`);

    // 4. Create Parent Document Record in Postgres via Prisma
    const docId = randomUUID();
    const doc = await this.prisma.document.create({
      data: {
        id: docId,
        title: meta.title,
        standardNumber: meta.standardNumber,
        category: meta.category || 'STANDARD',
        division: meta.division || 'General',
        sourceUrl: meta.sourceUrl || 'https://www.services.bis.gov.in',
        publicationDate: meta.publicationDate || new Date().toISOString().split('T')[0],
        lastUpdatedDate: new Date().toISOString().split('T')[0],
        status: meta.status || StandardStatus.ACTIVE,
        isIngested: true
      }
    });

    // 5. Embed each chunk and insert into Postgres document_chunks table
    let insertedChunks = 0;
    for (const ch of chunks) {
      const vector = await this.embedder.embedText(ch.content);
      const vecString = `[${vector.join(',')}]`;
      const chunkId = randomUUID();

      try {
        await this.prisma.$executeRaw`
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
            ${vecString}::vector,
            ${JSON.stringify(ch.metadata)}::jsonb,
            ${doc.status}::"StandardStatus",
            NOW()
          );
        `;
        insertedChunks++;
      } catch (err) {
        // Fallback without vector cast if vector extension unavailable in DB
        await this.prisma.documentChunk.create({
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
            status: doc.status
          }
        });
        insertedChunks++;
      }
    }

    this.logger.log(`Ingestion completed for ${doc.id}: ${insertedChunks} chunks saved.`);

    return {
      success: true,
      documentId: doc.id,
      standardNumber: doc.standardNumber,
      title: doc.title,
      chunksIngested: insertedChunks
    };
  }

  async listIngestedDocuments() {
    return this.prisma.document.findMany({
      include: {
        _count: {
          select: { chunks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
