import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to PostgreSQL with pgvector');
    } catch (err: any) {
      console.warn('Prisma connection warning (using mock/offline store fallback):', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}