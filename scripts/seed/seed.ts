import { PrismaClient } from '@prisma/client';
import {
  SEED_USERS,
  SEED_STANDARDS,
  SEED_SCHEMES,
  SEED_LABORATORIES,
  SEED_HALLMARKING_CENTRES
} from '../../packages/seed-data/src/index';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting SentinelX Database Seeding...');

  // 1. Seed Users
  console.log('Inserting seed users...');
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }

  // 2. Seed Standards & Clauses
  console.log('Inserting Indian Standards & Clauses...');
  for (const std of SEED_STANDARDS) {
    const createdStd = await prisma.standard.upsert({
      where: { standardNumber: std.standardNumber },
      update: std,
      create: std
    });

    // Seed document for RAG
    const doc = await prisma.document.create({
      data: {
        title: std.title,
        standardNumber: std.standardNumber,
        standardId: createdStd.id,
        category: 'STANDARD',
        division: std.division,
        sourceUrl: std.sourceUrl,
        publicationDate: std.publicationDate,
        lastUpdatedDate: std.lastUpdatedDate,
        status: std.status,
        isIngested: true
      }
    });

    // Create chunks
    await prisma.documentChunk.create({
      data: {
        documentId: doc.id,
        standardNumber: std.standardNumber,
        section: 'Scope and Requirements',
        clause: '1.0',
        page: 1,
        content: `Scope of ${std.standardNumber}: ${std.scope}\n\nAbstract: ${std.abstract}`,
        status: std.status,
        metadata: {
          title: std.title,
          isMandatory: std.isMandatory,
          qco: std.qcoNotificationNumber
        }
      }
    });
  }

  // 3. Seed Certification Schemes
  console.log('Inserting Certification Schemes...');
  for (const scheme of SEED_SCHEMES) {
    await prisma.certificationScheme.upsert({
      where: { code: scheme.code },
      update: scheme,
      create: scheme
    });
  }

  // 4. Seed Laboratories
  console.log('Inserting BIS Recognized Laboratories...');
  for (const lab of SEED_LABORATORIES) {
    await prisma.laboratory.upsert({
      where: { labCode: lab.labCode },
      update: lab,
      create: lab
    });
  }

  // 5. Seed Hallmarking Centres
  console.log('Inserting Assaying & Hallmarking Centres...');
  for (const centre of SEED_HALLMARKING_CENTRES) {
    await prisma.hallmarkingCentre.upsert({
      where: { centreCode: centre.centreCode },
      update: centre,
      create: centre
    });
  }

  console.log('✅ Database Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('⚠️ Seeding error (Database may be offline or initializing):', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
