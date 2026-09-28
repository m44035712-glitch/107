import { Module } from '@nestjs/common';
import { HallmarkingService } from './hallmarking.service';
import { HallmarkingController } from './hallmarking.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [HallmarkingController],
  providers: [HallmarkingService, PrismaService],
  exports: [HallmarkingService]
})
export class HallmarkingModule {}
