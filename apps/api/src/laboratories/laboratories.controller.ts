import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LaboratoriesService } from './laboratories.service';
import { type LaboratorySearchFilter } from '@bis/shared-types';

@ApiTags('Laboratories')
@Controller('laboratories')
export class LaboratoriesController {
  constructor(private laboratoriesService: LaboratoriesService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search BIS recognized and NABL accredited laboratories by state, city, or standard' })
  async searchLaboratories(@Body() filter: LaboratorySearchFilter) {
    return this.laboratoriesService.searchLaboratories(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific laboratory by ID or Lab Code' })
  async getLaboratoryById(@Param('id') id: string) {
    return this.laboratoriesService.getLaboratoryById(id);
  }
}
