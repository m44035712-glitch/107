import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { StandardsModule } from '../standards/standards.module';
import { TestingModule } from '../testing/testing.module';
import { LaboratoriesModule } from '../laboratories/laboratories.module';
import { HallmarkingModule } from '../hallmarking/hallmarking.module';
import { ConsumerModule } from '../consumer/consumer.module';
import { CertificationModule } from '../certification/certification.module';
import { RAGModule } from '../rag/rag.module';

@Module({
  imports: [
    StandardsModule,
    TestingModule,
    LaboratoriesModule,
    HallmarkingModule,
    ConsumerModule,
    CertificationModule,
    RAGModule
  ],
  providers: [AiAgentService],
  exports: [AiAgentService]
})
export class AiAgentModule {}

