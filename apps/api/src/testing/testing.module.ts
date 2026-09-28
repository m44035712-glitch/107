import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [TestingController],
  providers: [TestingService, PrismaService],
  exports: [TestingService]
})
export class TestingModule {}
