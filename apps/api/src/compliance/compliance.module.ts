import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { StandardsModule } from '../standards/standards.module';
import { CertificationModule } from '../certification/certification.module';
import { TestingModule } from '../testing/testing.module';
import { LaboratoriesModule } from '../laboratories/laboratories.module';

@Module({
  imports: [StandardsModule, CertificationModule, TestingModule, LaboratoriesModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService]
})
export class ComplianceModule {}
