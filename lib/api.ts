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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  || 'https://watcherai-backend.onrender.com';

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
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
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
 * Transform backend response to frontend AnalysisResult
 */
function transformAnalysisResponse(
  data: BackendAnalysisResponse,
  prompt: string,
  output: string
): AnalysisResult {
  // Transform components to HeadComponent format
  const keyComponents: HeadComponent[] = data.components.map((comp) => ({
    layer: comp.layer,
    head: comp.head,
    id: `L${comp.layer}H${comp.head}`,
    importance: comp.importance,
    label: comp.role || comp.description,
  }));

  // Transform connections to FlowConnection format
  const connections: FlowConnection[] = data.information_flow.connections.map((conn) => ({
    from: `L${conn.from_layer}H${conn.from_head}`,
    to: `L${conn.to_layer}H${conn.to_head}`,
    weight: conn.weight,
  }));

  return {
    id: data.request_id,
    timestamp: data.metadata.timestamp,
    prompt,
    output,
    metrics: {
      confidence: data.summary.confidence,
      riskLevel: data.risk_assessment.level,
      keyHeadsCount: data.summary.total_components,
      complexity: data.summary.complexity,
    },
    explanation: data.explanation.summary + (data.explanation.details ? `\n\n${data.explanation.details}` : ''),
    keyComponents,
    informationFlow: {
      connections,
      description: data.information_flow.description,
    },
    concerns: data.risk_assessment.concerns,
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
 * Submit prompt and response for analysis
 */
export async function analyze(
  request: { prompt: string; output: string }
): Promise<{ id: string }> {
  // Backend expects "response" not "output"
  const backendRequest: AnalysisRequest = {
    prompt: request.prompt,
    response: request.output,
  };

  const data = await fetchAPI<BackendAnalysisResponse>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify(backendRequest),
  });

  // Store the request data in sessionStorage for the results page
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`analysis_${data.request_id}`, JSON.stringify({
      prompt: request.prompt,
      output: request.output,
      response: data,
    }));
  }

  return { id: data.request_id };
}

/**
 * Get analysis results by ID
 */
export async function getAnalysis(id: string): Promise<AnalysisResult> {
  // First try to get from sessionStorage (for immediate redirect after analysis)
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(`analysis_${id}`);
    if (cached) {
      const { prompt, output, response } = JSON.parse(cached);
      return transformAnalysisResponse(response, prompt, output);
    }
  }

  // If not in cache, fetch from backend (for history items)
  const data = await fetchAPI<BackendAnalysisResponse>(`/api/analysis/${id}`);
  return transformAnalysisResponse(data, '', '');
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
