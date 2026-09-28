import { Module } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsController } from './standards.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [StandardsController],
  providers: [StandardsService, PrismaService],
  exports: [StandardsService]
})
export class StandardsModule {}
