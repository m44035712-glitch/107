import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TestingService } from './testing.service';
import { type TestingSearchFilter } from '@bis/shared-types';

@ApiTags('Testing Requirements')
@Controller('testing')
export class TestingController {
  constructor(private testingService: TestingService) {}

  @Post('requirements')
  @ApiOperation({ summary: 'Get mandatory and routine testing requirements by standard or product' })
  async getRequirements(@Body() filter: TestingSearchFilter) {
    return this.testingService.getTestingRequirements(filter);
  }
}
