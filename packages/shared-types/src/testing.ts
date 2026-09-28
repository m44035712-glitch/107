import { Evidence } from './rag';

export interface TestingRequirement {
  id: string;
  standardNumber: string;
  testName: string;
  testMethod: string; // e.g. "IS 10500 Clause 4 Table 1"
  clauseNumber: string;
  description: string;
  acceptanceCriteria: string;
  samplingRequirements: string;
  testingFrequency: string;
  requiredEquipment: string[];
  isDestructive: boolean;
  isMandatoryRoutineTest: boolean;
  applicableProducts: string[];
  sourceUrl?: string;
  evidence?: Evidence;
}

export interface TestingSearchFilter {
  standardNumber?: string;
  productName?: string;
  testName?: string;
  isDestructive?: boolean;
}
