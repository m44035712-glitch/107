import { StandardStatus } from './enums';
import { Evidence } from './rag';

export interface StandardClause {
  id: string;
  standardId: string;
  clauseNumber: string; // e.g., "5.2" or "4.1.3"
  title: string;
  content: string;
  pageNumber: number;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
  }>;
  subclauses?: StandardClause[];
}

export interface Standard {
  id: string;
  standardNumber: string; // e.g. "IS 10500:2012"
  title: string;
  year: number;
  department: string;
  division: string; // e.g., "Food and Agriculture", "Civil Engineering", "Electronics"
  status: StandardStatus;
  scope: string;
  abstract: string;
  keywords: string[];
  isMandatory: boolean;
  qcoNotificationNumber?: string;
  qcoDate?: string;
  sourceUrl: string;
  publicationDate: string;
  lastUpdatedDate: string;
  clauses?: StandardClause[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductProfileQuery {
  productName: string;
  material?: string;
  intendedApplication?: string;
  industry?: string;
  capacity?: string;
  technicalCharacteristics?: string;
  otherAttributes?: string;
  targetUserRole?: string;
}

export interface StandardRecommendationMatch {
  standard: Standard;
  relevanceScore: number; // 0 - 100
  matchReason: string;
  matchingAttributes: string[];
  missingInformationPrompt: string[];
  relatedStandards: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: Evidence[];
}

export interface ProductRecommendationResult {
  query: ProductProfileQuery;
  matches: StandardRecommendationMatch[];
  totalMatches: number;
  guidanceNotes: string;
  disclaimer: string;
}

export interface StandardComparisonResult {
  standards: Standard[];
  commonFeatures: string[];
  differences: Array<{
    parameter: string;
    values: Record<string, string>;
  }>;
  applicabilityCriteria: Record<string, string>;
  summary: string;
}
