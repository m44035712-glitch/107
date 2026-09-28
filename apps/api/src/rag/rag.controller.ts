import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RAGService } from './rag.service';
import { type RAGSearchRequest } from '@bis/shared-types';

@ApiTags('RAG Retrieval')
@Controller('rag')
export class RAGController {
  constructor(private ragService: RAGService) {}

  @Post('search')
  @ApiOperation({ summary: 'Execute hybrid retrieval (BM25 + Semantic Search + Reranking) across BIS knowledge base' })
  async searchEvidence(@Body() request: RAGSearchRequest) {
    return this.ragService.searchEvidence(request);
  }
}
