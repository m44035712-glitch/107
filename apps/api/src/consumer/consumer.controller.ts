import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';

@ApiTags('Consumer Protection')
@Controller('consumer')
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @Post('verify-isi')
  @ApiOperation({ summary: 'Verify ISI Mark CM/L Number structure and authenticity checklist' })
  async verifyIsi(@Body() body: { cmlNumber: string }) {
    return this.consumerService.verifyIsiMark(body.cmlNumber);
  }

  @Get('grievance')
  @ApiOperation({ summary: 'Get grievance redressal procedures for fake ISI marks and substandard goods' })
  async getGrievance() {
    return this.consumerService.getGrievanceGuidance();
  }
}
