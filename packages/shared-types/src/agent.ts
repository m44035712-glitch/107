import { QueryIntent } from './enums';
import { Citation, Evidence } from './rag';

export type ToolName =
  | 'search_standards'
  | 'recommend_standards'
  | 'get_standard_details'
  | 'search_certification_schemes'
  | 'get_certification_process'
  | 'get_testing_requirements'
  | 'search_laboratories'
  | 'search_hallmarking_information'
  | 'search_hallmarking_centres'
  | 'search_consumer_information'
  | 'search_bis_documents'
  | 'get_source_details'
  | 'translate_query';

export interface ToolCallPayload {
  tool: ToolName;
  arguments: Record<string, unknown>;
}

export interface ToolExecutionResult {
  tool: ToolName;
  success: boolean;
  data: unknown;
  evidence: Evidence[];
  error?: string;
}

export interface AgentStepTrace {
  stepNumber: number;
  thoughtSummary?: string; // Internal, not exposed directly to user in raw form
  toolCalled?: ToolName;
  arguments?: Record<string, unknown>;
  evidenceCount?: number;
}

export interface AgentExecutionResponse {
  query: string;
  intent: QueryIntent;
  structuredAnswer: string;
  citations: Citation[];
  evidence: Evidence[];
  suggestedFollowUps: string[];
  workflowOffers: Array<{
    type: 'FIND_TESTING' | 'FIND_LAB' | 'VIEW_ROADMAP' | 'GENERATE_REPORT' | 'VERIFY_ISI';
    label: string;
    actionPayload: Record<string, unknown>;
  }>;
}
