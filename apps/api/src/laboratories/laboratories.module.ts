import { Module } from '@nestjs/common';
import { LaboratoriesService } from './laboratories.service';
import { LaboratoriesController } from './laboratories.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [LaboratoriesController],
  providers: [LaboratoriesService, PrismaService],
  exports: [LaboratoriesService]
})
export class LaboratoriesModule {}
