import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { type ProductProfileQuery } from '@bis/shared-types';

@ApiTags('Compliance Reports')
@ApiBearerAuth()
@Controller('compliance')
export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  @Post('generate-report')
  @ApiOperation({
    summary:
      'Generate comprehensive downloadable BIS Compliance Report with citations'
  })
  async generateReport(@Body() profile: ProductProfileQuery) {
    return this.complianceService.generateReport(profile);
  }
}