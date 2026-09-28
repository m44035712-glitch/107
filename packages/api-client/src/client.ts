import {
  AuthResponse,
  ChatMessage,
  ChatSession,
  CertificationScheme,
  ComplianceRoadmapStep,
  FeedbackType,
  HallmarkingCentre,
  HallmarkingGuidance,
  HuidValidationResult,
  IsiVerificationResult,
  Laboratory,
  LaboratorySearchFilter,
  ProductComplianceReport,
  ProductProfileQuery,
  ProductRecommendationResult,
  QueryAnalyticsData,
  RAGEvaluationResultMetrics,
  RAGSearchRequest,
  RAGSearchResponse,
  Standard,
  StandardComparisonResult,
  TestingRequirement,
  TestingSearchFilter,
  UserProfile,
  UserRole
} from '@bis/shared-types';

export class BisApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? '/api/v1' : 'http://localhost:4000/api/v1');
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('bis_access_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('bis_access_token', token);
      } else {
        localStorage.removeItem('bis_access_token');
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMsg = `API request failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.message || errorJson.error || errorMsg;
      } catch {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return response.json() as Promise<T>;
  }

  // --- Auth APIs ---
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.tokens.accessToken);
    return res;
  }

  async register(data: { email: string; password: string; fullName: string; role: UserRole; organization?: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    this.setToken(res.tokens.accessToken);
    return res;
  }

  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/profile');
  }

  // --- Standards APIs ---
  async searchStandards(query: string, filter?: { division?: string; isMandatory?: boolean; status?: string }): Promise<{ standards: Standard[]; total: number }> {
    return this.request('/standards/search', {
      method: 'POST',
      body: JSON.stringify({ query, filter })
    });
  }

  async getStandardById(id: string): Promise<Standard> {
    return this.request<Standard>(`/standards/${id}`);
  }

  async recommendStandards(profile: ProductProfileQuery): Promise<ProductRecommendationResult> {
    return this.request<ProductRecommendationResult>('/standards/recommend', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  }

  async compareStandards(standardNumbers: string[]): Promise<StandardComparisonResult> {
    return this.request<StandardComparisonResult>('/standards/compare', {
      method: 'POST',
      body: JSON.stringify({ standardNumbers })
    });
  }

  // --- Chat & RAG APIs ---
  async sendMessage(params: { sessionId?: string; message: string; roleMode?: string; language?: string; autoDetectLanguage?: boolean }): Promise<{ session: ChatSession; reply: ChatMessage }> {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return this.request<ChatSession[]>('/chat/sessions');
  }

  async getChatSession(id: string): Promise<ChatSession> {
    return this.request<ChatSession>(`/chat/sessions/${id}`);
  }

  async submitFeedback(data: { messageId: string; feedback: FeedbackType; notes?: string }): Promise<{ success: boolean }> {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // --- Certification APIs ---
  async getCertificationSchemes(): Promise<CertificationScheme[]> {
    return this.request<CertificationScheme[]>('/certification/schemes');
  }

  async getCertificationRoadmap(standardNumber: string, productType?: string): Promise<{ steps: ComplianceRoadmapStep[] }> {
    return this.request('/certification/roadmap', {
      method: 'POST',
      body: JSON.stringify({ standardNumber, productType })
    });
  }

  // --- Testing & Laboratory APIs ---
  async getTestingRequirements(filter: TestingSearchFilter): Promise<TestingRequirement[]> {
    return this.request('/testing/requirements', {
      method: 'POST',
      body: JSON.stringify(filter)
    });
  }

  async searchLaboratories(filter: LaboratorySearchFilter): Promise<{ laboratories: Laboratory[]; total: number }> {
    return this.request('/laboratories/search', {
      method: 'POST',
      body: JSON.stringify(filter)
    });
  }

  // --- Hallmarking & Consumer APIs ---
  async getHallmarkingGuidance(): Promise<HallmarkingGuidance> {
    return this.request<HallmarkingGuidance>('/hallmarking/guidance');
  }

  async validateHuid(huid: string): Promise<HuidValidationResult> {
    return this.request<HuidValidationResult>('/hallmarking/validate-huid', {
      method: 'POST',
      body: JSON.stringify({ huid })
    });
  }

  async searchHallmarkingCentres(state?: string, city?: string): Promise<HallmarkingCentre[]> {
    return this.request('/hallmarking/centres', {
      method: 'POST',
      body: JSON.stringify({ state, city })
    });
  }

  async verifyIsiMark(cmlNumber: string): Promise<IsiVerificationResult> {
    return this.request<IsiVerificationResult>('/consumer/verify-isi', {
      method: 'POST',
      body: JSON.stringify({ cmlNumber })
    });
  }

  // --- Compliance Report Generation ---
  async generateComplianceReport(profile: ProductProfileQuery): Promise<ProductComplianceReport> {
    return this.request<ProductComplianceReport>('/compliance/generate-report', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  }

  // --- Admin & Analytics APIs ---
  async getAnalytics(): Promise<QueryAnalyticsData> {
    return this.request<QueryAnalyticsData>('/analytics');
  }

  async getEvaluationMetrics(): Promise<RAGEvaluationResultMetrics> {
    return this.request<RAGEvaluationResultMetrics>('/admin/evaluation');
  }

  async searchKnowledgeDocuments(query: RAGSearchRequest): Promise<RAGSearchResponse> {
    return this.request<RAGSearchResponse>('/rag/search', {
      method: 'POST',
      body: JSON.stringify(query)
    });
  }
}

export const apiClient = new BisApiClient();
