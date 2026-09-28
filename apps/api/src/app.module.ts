import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StandardsModule } from './standards/standards.module';
import { CertificationModule } from './certification/certification.module';
import { TestingModule } from './testing/testing.module';
import { LaboratoriesModule } from './laboratories/laboratories.module';
import { HallmarkingModule } from './hallmarking/hallmarking.module';
import { ConsumerModule } from './consumer/consumer.module';
import { RAGModule } from './rag/rag.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { ChatModule } from './chat/chat.module';
import { ComplianceModule } from './compliance/compliance.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AdminModule } from './admin/admin.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env']
    }),
    AuthModule,
    StandardsModule,
    CertificationModule,
    TestingModule,
    LaboratoriesModule,
    HallmarkingModule,
    ConsumerModule,
    RAGModule,
    AiAgentModule,
    ChatModule,
    ComplianceModule,
    FeedbackModule,
    AnalyticsModule,
    AdminModule,
    DocumentsModule
  ],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
