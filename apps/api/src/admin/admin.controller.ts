import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@bis/shared-types';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('evaluation')
  @ApiOperation({
    summary:
      'Run and retrieve RAG precision, recall@k, and faithfulness evaluation metrics'
  })
  async getEvaluationMetrics() {
    return this.adminService.getEvaluationMetrics();
  }

  @Get('health')
  @ApiOperation({
    summary:
      'Check SentinelX system status and pipeline health'
  })
  async getHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('documents')
  @ApiOperation({
    summary:
      'List all authorized ingested documents and chunk status'
  })
  async getDocuments() {
    return this.adminService.getDocuments();
  }
}