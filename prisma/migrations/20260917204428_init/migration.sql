-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CONSUMER', 'INDUSTRY', 'STUDENT_RESEARCHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StandardStatus" AS ENUM ('ACTIVE', 'UNDER_REVIEW', 'OUTDATED', 'WITHDRAWN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CertificationSchemeType" AS ENUM ('SCHEME_I_ISI', 'SCHEME_II_CRS', 'SCHEME_IV_COC', 'SCHEME_FMCS', 'SCHEME_ECO_MARK', 'SCHEME_HALLMARK');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('HELPFUL', 'NOT_HELPFUL', 'REPORTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'INDUSTRY',
    "organization" TEXT,
    "designation" TEXT,
    "phoneNumber" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "roleMode" TEXT NOT NULL DEFAULT 'INDUSTRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "originalLanguage" TEXT,
    "intent" TEXT,
    "confidence" TEXT,
    "citations" JSONB,
    "evidence" JSONB,
    "suggestedFollowUps" JSONB,
    "groundingStatus" JSONB,
    "sourceFreshnessWarning" TEXT,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standards" (
    "id" TEXT NOT NULL,
    "standardNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "status" "StandardStatus" NOT NULL DEFAULT 'ACTIVE',
    "scope" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "keywords" JSONB NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "qcoNotificationNumber" TEXT,
    "qcoDate" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "publicationDate" TEXT NOT NULL,
    "lastUpdatedDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standard_clauses" (
    "id" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "clauseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "tables" JSONB,
    "subclauses" JSONB,

    CONSTRAINT "standard_clauses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "standardNumber" TEXT,
    "standardId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'STANDARD',
    "division" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "version" TEXT,
    "publicationDate" TEXT NOT NULL,
    "lastUpdatedDate" TEXT NOT NULL,
    "status" "StandardStatus" NOT NULL DEFAULT 'ACTIVE',
    "isIngested" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_chunks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "standardNumber" TEXT NOT NULL,
    "section" TEXT,
    "clause" TEXT NOT NULL,
    "subclause" TEXT,
    "page" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vectorEmbedding" vector(1536),
    "metadata" JSONB,
    "status" "StandardStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_schemes" (
    "id" TEXT NOT NULL,
    "schemeType" "CertificationSchemeType" NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applicability" TEXT NOT NULL,
    "applicableSectors" JSONB NOT NULL,
    "mandatoryProductCategories" JSONB NOT NULL,
    "keySteps" JSONB NOT NULL,
    "requiredDocuments" JSONB NOT NULL,
    "feeStructureSummary" TEXT NOT NULL,
    "surveillanceFrequency" TEXT NOT NULL,
    "validityPeriod" TEXT NOT NULL,
    "officialGuidelineUrl" TEXT NOT NULL,

    CONSTRAINT "certification_schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testing_requirements" (
    "id" TEXT NOT NULL,
    "standardNumber" TEXT NOT NULL,
    "standardId" TEXT,
    "testName" TEXT NOT NULL,
    "testMethod" TEXT NOT NULL,
    "clauseNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "acceptanceCriteria" TEXT NOT NULL,
    "samplingRequirements" TEXT NOT NULL,
    "testingFrequency" TEXT NOT NULL,
    "requiredEquipment" JSONB NOT NULL,
    "isDestructive" BOOLEAN NOT NULL DEFAULT false,
    "isMandatoryRoutineTest" BOOLEAN NOT NULL DEFAULT true,
    "applicableProducts" JSONB NOT NULL,
    "sourceUrl" TEXT,

    CONSTRAINT "testing_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "labCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "contactPerson" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "recognitionStatus" TEXT NOT NULL DEFAULT 'RECOGNIZED',
    "validUpTo" TEXT NOT NULL,
    "accreditationBody" TEXT NOT NULL DEFAULT 'NABL (ISO/IEC 17025)',
    "recognizedStandards" JSONB NOT NULL,
    "testingCapabilities" JSONB NOT NULL,
    "isNablAccredited" BOOLEAN NOT NULL DEFAULT true,
    "isBisRecognized" BOOLEAN NOT NULL DEFAULT true,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "sourceUrl" TEXT NOT NULL,
    "lastUpdatedDate" TEXT NOT NULL,

    CONSTRAINT "laboratories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hallmarking_centres" (
    "id" TEXT NOT NULL,
    "centreName" TEXT NOT NULL,
    "centreCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "recognizedMetals" JSONB NOT NULL,
    "recognitionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "validUpTo" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "hallmarking_centres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "standardNumber" TEXT,
    "publicationDate" TEXT NOT NULL,
    "status" "StandardStatus" NOT NULL DEFAULT 'ACTIVE',
    "verifiedBy" TEXT NOT NULL DEFAULT 'BIS Portal Synchronizer',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "messageId" TEXT,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "feedbackType" "FeedbackType" NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "query_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "queryText" TEXT NOT NULL,
    "detectedLanguage" TEXT NOT NULL DEFAULT 'en',
    "intent" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "topStandardMatch" TEXT,
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_results" (
    "id" TEXT NOT NULL,
    "benchmarkVersion" TEXT NOT NULL DEFAULT 'v1.0',
    "totalEvaluated" INTEGER NOT NULL,
    "recallAt1" DOUBLE PRECISION NOT NULL,
    "recallAt3" DOUBLE PRECISION NOT NULL,
    "recallAt5" DOUBLE PRECISION NOT NULL,
    "precisionAt1" DOUBLE PRECISION NOT NULL,
    "precisionAt3" DOUBLE PRECISION NOT NULL,
    "mrr" DOUBLE PRECISION NOT NULL,
    "top1Accuracy" DOUBLE PRECISION NOT NULL,
    "top3Accuracy" DOUBLE PRECISION NOT NULL,
    "faithfulnessScore" DOUBLE PRECISION NOT NULL,
    "contextRelevanceScore" DOUBLE PRECISION NOT NULL,
    "answerRelevanceScore" DOUBLE PRECISION NOT NULL,
    "citationCorrectnessRate" DOUBLE PRECISION NOT NULL,
    "averageLatencyMs" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluation_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "standards_standardNumber_key" ON "standards"("standardNumber");

-- CreateIndex
CREATE INDEX "standards_standardNumber_idx" ON "standards"("standardNumber");

-- CreateIndex
CREATE INDEX "standards_division_idx" ON "standards"("division");

-- CreateIndex
CREATE INDEX "standards_isMandatory_idx" ON "standards"("isMandatory");

-- CreateIndex
CREATE INDEX "standard_clauses_standardId_clauseNumber_idx" ON "standard_clauses"("standardId", "clauseNumber");

-- CreateIndex
CREATE INDEX "document_chunks_documentId_idx" ON "document_chunks"("documentId");

-- CreateIndex
CREATE INDEX "document_chunks_standardNumber_idx" ON "document_chunks"("standardNumber");

-- CreateIndex
CREATE INDEX "document_chunks_clause_idx" ON "document_chunks"("clause");

-- CreateIndex
CREATE UNIQUE INDEX "certification_schemes_code_key" ON "certification_schemes"("code");

-- CreateIndex
CREATE INDEX "testing_requirements_standardNumber_idx" ON "testing_requirements"("standardNumber");

-- CreateIndex
CREATE INDEX "testing_requirements_testName_idx" ON "testing_requirements"("testName");

-- CreateIndex
CREATE UNIQUE INDEX "laboratories_labCode_key" ON "laboratories"("labCode");

-- CreateIndex
CREATE INDEX "laboratories_city_idx" ON "laboratories"("city");

-- CreateIndex
CREATE INDEX "laboratories_state_idx" ON "laboratories"("state");

-- CreateIndex
CREATE UNIQUE INDEX "hallmarking_centres_centreCode_key" ON "hallmarking_centres"("centreCode");

-- CreateIndex
CREATE INDEX "hallmarking_centres_city_idx" ON "hallmarking_centres"("city");

-- CreateIndex
CREATE INDEX "hallmarking_centres_state_idx" ON "hallmarking_centres"("state");

-- CreateIndex
CREATE INDEX "query_logs_intent_idx" ON "query_logs"("intent");

-- CreateIndex
CREATE INDEX "query_logs_detectedLanguage_idx" ON "query_logs"("detectedLanguage");

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standard_clauses" ADD CONSTRAINT "standard_clauses_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "standards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "standards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testing_requirements" ADD CONSTRAINT "testing_requirements_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "standards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "query_logs" ADD CONSTRAINT "query_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
