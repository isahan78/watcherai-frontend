import {
  AnalysisRequest,
  AnalysisResult,
  HistoryItem,
  BackendAnalysisResponse,
  BackendHistoryResponse,
  HealthResponse,
  HeadComponent,
  FlowConnection,
} from './types';

// Use local API proxy routes to bypass CORS
const API_BASE = '/api';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      response.status,
      error.detail || error.message || 'An error occurred'
    );
  }

  return response.json();
}

/**
 * Parse head ID like "L1H5" into layer and head numbers
 */
function parseHeadId(id: string): { layer: number; head: number } {
  const match = id.match(/L(\d+)H(\d+|None)/);
  if (match) {
    return {
      layer: parseInt(match[1], 10),
      head: match[2] === 'None' ? 0 : parseInt(match[2], 10),
    };
  }
  return { layer: 0, head: 0 };
}

/**
 * Convert strength to numeric weight
 */
function strengthToWeight(strength: 'weak' | 'medium' | 'strong'): number {
  switch (strength) {
    case 'strong': return 0.9;
    case 'medium': return 0.6;
    case 'weak': return 0.3;
    default: return 0.3;
  }
}

/**
 * Transform backend response to frontend AnalysisResult
 */
function transformAnalysisResponse(
  data: BackendAnalysisResponse,
  id: string,
  prompt: string,
  output: string
): AnalysisResult {
  // Transform components to HeadComponent format
  const keyComponents: HeadComponent[] = data.key_components.map((comp) => {
    const { layer, head } = parseHeadId(comp.id);
    return {
      layer,
      head,
      id: comp.id,
      importance: comp.importance,
      label: comp.label,
    };
  });

  // Transform edges to FlowConnection format
  const connections: FlowConnection[] = data.information_flow.edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
    weight: strengthToWeight(edge.strength),
  }));

  // Transform risk factors to concerns
  const concerns = data.risk_assessment.factors.map((factor) => ({
    type: factor.includes('moderate') ? 'warning' as const :
          factor.includes('high') || factor.includes('severe') ? 'danger' as const :
          'safe' as const,
    message: factor.replace(/^(low_|moderate_|high_)/, '').replace(/_/g, ' '),
  }));

  // Add safe message if no concerns
  if (concerns.length === 0) {
    concerns.push({
      type: 'safe' as const,
      message: 'No significant concerns detected',
    });
  }

  return {
    id,
    timestamp: new Date().toISOString(),
    prompt,
    output,
    metrics: {
      confidence: data.summary.confidence,
      riskLevel: data.summary.risk_level,
      keyHeadsCount: data.metadata.num_heads_analyzed,
      complexity: data.summary.complexity,
    },
    explanation: `${data.explanation.short}\n\n${data.explanation.detailed}`,
    keyComponents,
    informationFlow: {
      connections,
      description: data.information_flow.summary,
    },
    concerns,
    metadata: {
      analysisTimeMs: data.metadata.analysis_time_ms,
      modelAnalyzed: data.metadata.model_analyzed,
      recommendation: data.risk_assessment.recommendation,
    },
  };
}

/**
 * Transform backend history response to frontend HistoryItem[]
 */
function transformHistoryResponse(data: BackendHistoryResponse): HistoryItem[] {
  return data.items.map((item) => ({
    id: item.request_id,
    timestamp: item.timestamp,
    promptPreview: item.prompt.length > 50 ? item.prompt.slice(0, 50) + '...' : item.prompt,
    outputPreview: item.response.length > 50 ? item.response.slice(0, 50) + '...' : item.response,
    riskLevel: item.risk_level,
    confidence: item.confidence,
  }));
}

/**
 * Generate a unique ID for the analysis
 */
function generateId(): string {
  return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Submit prompt and output for analysis
 */
export async function analyze(
  request: { prompt: string; output: string }
): Promise<{ id: string }> {
  const backendRequest: AnalysisRequest = {
    prompt: request.prompt,
    output: request.output,
  };

  const data = await fetchAPI<BackendAnalysisResponse>('/analyze', {
    method: 'POST',
    body: JSON.stringify(backendRequest),
  });

  // Generate an ID since backend doesn't return one
  const id = generateId();

  // Store the request data in sessionStorage for the results page
  if (typeof window !== 'undefined') {
    const result = transformAnalysisResponse(data, id, request.prompt, request.output);
    sessionStorage.setItem(`analysis_${id}`, JSON.stringify(result));
  }

  return { id };
}

/**
 * Get analysis results by ID
 */
export async function getAnalysis(id: string): Promise<AnalysisResult> {
  // Get from sessionStorage (analysis results are cached after submission)
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(`analysis_${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  // If not in cache, throw error (backend doesn't persist results by ID)
  throw new Error('Analysis not found. Results are only available immediately after analysis.');
}

/**
 * Get analysis history
 */
export async function getHistory(
  limit: number = 20,
  offset: number = 0
): Promise<HistoryItem[]> {
  const data = await fetchAPI<BackendHistoryResponse>(
    `/history?limit=${limit}&offset=${offset}`
  );
  return transformHistoryResponse(data);
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<HealthResponse> {
  return fetchAPI('/health');
}
