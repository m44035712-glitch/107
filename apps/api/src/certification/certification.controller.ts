import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CertificationService } from './certification.service';

@ApiTags('Certification')
@Controller('certification')
export class CertificationController {
  constructor(private certificationService: CertificationService) {}

  @Get('schemes')
  @ApiOperation({ summary: 'Get list of all BIS Certification Schemes (Scheme I ISI, Scheme II CRS, etc.)' })
  async getSchemes() {
    return this.certificationService.getSchemes();
  }

  @Get('schemes/:code')
  @ApiOperation({ summary: 'Get specific certification scheme details by scheme code' })
  async getSchemeByCode(@Param('code') code: string) {
    return this.certificationService.getSchemeByCode(code);
  }

  @Post('roadmap')
  @ApiOperation({ summary: 'Generate step-by-step certification roadmap for a given Indian Standard' })
  async getRoadmap(@Body() body: { standardNumber: string; productType?: string }) {
    return this.certificationService.getRoadmap(body.standardNumber, body.productType);
  }
}
