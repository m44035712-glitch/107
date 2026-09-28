import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [CertificationController],
  providers: [CertificationService, PrismaService],
  exports: [CertificationService]
})
export class CertificationModule {}
