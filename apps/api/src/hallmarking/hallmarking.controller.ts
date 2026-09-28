import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HallmarkingService } from './hallmarking.service';

@ApiTags('Hallmarking')
@Controller('hallmarking')
export class HallmarkingController {
  constructor(private hallmarkingService: HallmarkingService) {}

  @Get('guidance')
  @ApiOperation({ summary: 'Get official Gold and Silver purity fineness grades, HUID rules, and consumer rights' })
  async getGuidance() {
    return this.hallmarkingService.getGuidance();
  }

  @Post('validate-huid')
  @ApiOperation({ summary: 'Validate 6-digit alphanumeric HUID format and get BIS Care verification steps' })
  async validateHuid(@Body() body: { huid: string }) {
    return this.hallmarkingService.validateHuid(body.huid);
  }

  @Post('centres')
  @ApiOperation({ summary: 'Search recognized Assaying & Hallmarking Centres by state or city' })
  async searchCentres(@Body() body: { state?: string; city?: string }) {
    return this.hallmarkingService.searchCentres(body.state, body.city);
  }
}
