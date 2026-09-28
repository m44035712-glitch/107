import { CertificationSchemeType } from './enums';
import { Evidence } from './rag';

export interface CertificationScheme {
  id: string;
  schemeType: CertificationSchemeType;
  name: string; // e.g. "Scheme I - Product Certification Scheme (ISI Mark)"
  code: string; // e.g. "SCHEME-I"
  description: string;
  applicability: string;
  applicableSectors: string[];
  mandatoryProductCategories: string[];
  keySteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    responsibleParty: string; // Applicant / BIS / Recognized Lab
    estimatedDuration: string;
  }>;
  requiredDocuments: string[];
  feeStructureSummary: string;
  surveillanceFrequency: string;
  validityPeriod: string;
  officialGuidelineUrl: string;
}

export interface ComplianceRoadmapStep {
  stepNumber: number;
  phaseName: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'OPTIONAL';
  category: 'PREPARATION' | 'TESTING' | 'APPLICATION' | 'INSPECTION' | 'GRANT' | 'SURVEILLANCE';
  description: string;
  actionItems: string[];
  requiredDocuments: string[];
  estimatedTimeframe: string;
  relevantStandards: string[];
  warningsAndTips?: string[];
  officialForms?: string[];
  evidence?: Evidence[];
}

export interface ProductComplianceReport {
  id: string;
  productName: string;
  manufacturerType: 'INDIAN_MSME' | 'LARGE_DOMESTIC' | 'FOREIGN_MANUFACTURER';
  generationDate: string;
  applicableStandards: Array<{
    standardNumber: string;
    title: string;
    isMandatory: boolean;
    qcoDetails?: string;
    keyClauses: string[];
  }>;
  certificationScheme: CertificationScheme;
  testingChecklist: Array<{
    testName: string;
    clause: string;
    isMandatory: boolean;
    samplingRule: string;
  }>;
  accreditedLaboratories: Array<{
    name: string;
    location: string;
    accreditationStatus: string;
  }>;
  roadmap: ComplianceRoadmapStep[];
  documentationChecklist: string[];
  potentialPitfalls: string[];
  citations: Evidence[];
  disclaimer: string;
}
