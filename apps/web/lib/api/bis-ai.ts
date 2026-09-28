import { apiClient } from '@bis/api-client';
import {
  ChatMessage,
  ChatSession,
  IndianLanguage,
  ProductComplianceReport,
  ProductProfileQuery,
  ProductRecommendationResult,
  Standard,
  TestingRequirement,
  TestingSearchFilter,
  UserRole
} from '@bis/shared-types';

/**
 * Frontend BIS AI Helper API Wrapper
 * All calls are securely routed to the server API routes.
 */
export async function askBISAI(params: {
  sessionId?: string;
  message: string;
  roleMode?: UserRole;
  language?: IndianLanguage;
}): Promise<{ session: ChatSession; reply: ChatMessage }> {
  return apiClient.sendMessage({
    sessionId: params.sessionId,
    message: params.message,
    roleMode: params.roleMode,
    language: params.language
  });
}

export async function searchStandards(
  query: string,
  filter?: { division?: string; isMandatory?: boolean; status?: string }
): Promise<{ standards: Standard[]; total: number }> {
  return apiClient.searchStandards(query, filter);
}

export async function recommendStandards(profile: ProductProfileQuery): Promise<ProductRecommendationResult> {
  return apiClient.recommendStandards(profile);
}

export async function getTestingRequirements(filter: TestingSearchFilter): Promise<TestingRequirement[]> {
  return apiClient.getTestingRequirements(filter);
}

export async function checkCompliance(specification: Record<string, any>, standardNumber?: string) {
  const res = await fetch('/api/v1/compliance/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ specification, standardNumber })
  });
  if (!res.ok) throw new Error('Compliance check failed');
  return res.json();
}

export async function analyzeDocument(text: string, filename?: string) {
  const res = await fetch('/api/v1/ai/analyze-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, filename })
  });
  if (!res.ok) throw new Error('Document analysis failed');
  return res.json();
}

export async function generateComplianceReport(profile: ProductProfileQuery): Promise<ProductComplianceReport> {
  return apiClient.generateComplianceReport(profile);
}
