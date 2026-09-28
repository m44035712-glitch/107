import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService, IngestDocumentDto } from './documents.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@bis/shared-types';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('ingest-text')
  @ApiOperation({ summary: 'Ingest raw text content for an Indian Standard document' })
  async ingestRawText(
    @Body() body: { text: string; title: string; standardNumber: string; sourceUrl?: string; publicationDate?: string }
  ) {
    if (!body.text || !body.title || !body.standardNumber) {
      throw new BadRequestException('text, title, and standardNumber are required fields');
    }

    return this.documentsService.ingestDocument(body.text, 'text', {
      title: body.title,
      standardNumber: body.standardNumber,
      sourceUrl: body.sourceUrl,
      publicationDate: body.publicationDate
    });
  }

  @Post('ingest-file')
  @ApiOperation({ summary: 'Ingest PDF or HTML file document' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async ingestFile(
    @UploadedFile() file: any,
    @Body() body: IngestDocumentDto
  ) {
    if (!file) {
      throw new BadRequestException('A PDF or HTML file is required');
    }

    let fileType: 'pdf' | 'html' | 'text' = 'text';
    if (file.mimetype.includes('pdf') || file.originalname.endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (
      file.mimetype.includes('html') ||
      file.originalname.endsWith('.html') ||
      file.originalname.endsWith('.htm')
    ) {
      fileType = 'html';
    }

    return this.documentsService.ingestDocument(file.buffer, fileType, body);
  }

  @Get('status')
  @ApiOperation({ summary: 'List all ingested standards documents and chunk counts' })
  async listDocuments() {
    return this.documentsService.listIngestedDocuments();
  }
}