-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_III_COPC';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_IV_COPC_PROCESS';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_V_MANAGEMENT_PROCESS';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_VI_SUPPLIER_DECLARATION';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_VII_PILOT_PRODUCTION';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_VIII_CUSTOM_IMPORT';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_IX_ECO_MARK';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'SCHEME_X_FOREIGN_MANUFACTURERS';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'HALLMARKING';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'MANAGEMENT_SYSTEMS_MSCS';
ALTER TYPE "CertificationSchemeType" ADD VALUE 'LABORATORY_RECOGNITION_LRS';
