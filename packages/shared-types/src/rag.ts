import { ConfidenceLevel, IndianLanguage, QueryIntent, StandardStatus } from './enums';

export interface Evidence {
  id: string;
  documentTitle: string;
  standardNumber: string;
  section?: string;
  clause: string;
  subclause?: string;
  page: number;
  version?: string;
  publicationDate: string;
  status: StandardStatus;
  sourceUrl: string;
  excerpt: string;
  similarityScore: number;
  rerankScore?: number;
  isOutdated?: boolean;
}

export interface Citation {
  citationNumber: number;
  standardNumber: string;
  clause?: string;
  section?: string;
  page?: number;
  sourceUrl: string;
  snippet: string;
  evidenceId: string;
}

export interface RAGSearchFilter {
  standardNumber?: string;
  division?: string;
  status?: StandardStatus;
  isMandatory?: boolean;
  minYear?: number;
  maxYear?: number;
  limit?: number;
}

export interface RAGSearchRequest {
  query: string;
  language?: IndianLanguage;
  filters?: RAGSearchFilter;
  userRole?: string;
  topK?: number;
}

export interface RAGSearchResponse {
  query: string;
  rewrittenQuery?: string;
  detectedLanguage: IndianLanguage;
  intent: QueryIntent;
  results: Evidence[];
  totalRetrieved: number;
  processingTimeMs: number;
}

export interface GroundingValidationResult {
  isFullyGrounded: boolean;
  supportedClaimsCount: number;
  unsupportedClaimsCount: number;
  confidenceScore: number; // 0.0 - 1.0
  confidenceLevel: ConfidenceLevel;
  groundingDetails: Array<{
    claim: string;
    isSupported: boolean;
    supportingEvidenceId?: string;
    note?: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  originalLanguage?: IndianLanguage;
  intent?: QueryIntent;
  confidence?: ConfidenceLevel;
  citations?: Citation[];
  evidence?: Evidence[];
  suggestedFollowUps?: string[];
  groundingStatus?: GroundingValidationResult;
  sourceFreshnessWarning?: string;
  createdAt: string;
  feedback?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  userId?: string;
  language: IndianLanguage;
  roleMode: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
