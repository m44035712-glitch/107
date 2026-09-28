import { StandardStatus } from '../../packages/shared-types/src';
import { RawDocumentSection, StructureAwareDocumentChunker } from '../../packages/ai/src/chunking/structure-chunker';

export async function processAuthorizedBISDocument(
  docTitle: string,
  standardNumber: string,
  rawSections: RawDocumentSection[]
) {
  console.log(`📑 Ingesting and chunking authorized BIS standard: ${standardNumber} - ${docTitle}`);
  const chunker = new StructureAwareDocumentChunker();
  const chunks = chunker.chunkDocument(rawSections);

  console.log(`✅ Generated ${chunks.length} structure-aware chunks with preserved clause & page metadata.`);
  return chunks;
}
