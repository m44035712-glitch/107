import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StandardsService } from './standards.service';
import { type ProductProfileQuery } from '@bis/shared-types';

@ApiTags('Indian Standards')
@Controller('standards')
export class StandardsController {
  constructor(private standardsService: StandardsService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search Indian Standards by keyword, division, and mandatory status' })
  async searchStandards(@Body() body: { query: string; filter?: any }) {
    return this.standardsService.searchStandards(body.query, body.filter);
  }

  @Post('recommend')
  @ApiOperation({ summary: 'Find My Standard: Recommend Indian Standards from product profile attributes' })
  async recommendStandards(@Body() profile: ProductProfileQuery) {
    return this.standardsService.recommendStandards(profile);
  }

  @Post('compare')
  @ApiOperation({ summary: 'Compare two or more Indian Standards side-by-side' })
  async compareStandards(@Body() body: { standardNumbers: string[] }) {
    return this.standardsService.compareStandards(body.standardNumbers);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific Indian Standard details by ID or Standard Number' })
  async getStandardById(@Param('id') id: string) {
    return this.standardsService.getStandardById(id);
  }
}
