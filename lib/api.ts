import {
  AnalysisRequest,
  AnalysisResult,
  HistoryItem,
  CircuitDiscoveryRequest,
  DeceptionCheckRequest,
  DeceptionResult,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  const response = await fetch(`${API_URL}${endpoint}`, {
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
      error.detail || 'An error occurred'
    );
  }

  return response.json();
}

/**
 * Submit prompt and output for analysis
 */
export async function analyze(
  request: AnalysisRequest
): Promise<{ id: string }> {
  return fetchAPI('/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get analysis results by ID
 */
export async function getAnalysis(id: string): Promise<AnalysisResult> {
  return fetchAPI(`/analysis/${id}`);
}

/**
 * Get analysis history
 */
export async function getHistory(
  limit: number = 20
): Promise<HistoryItem[]> {
  return fetchAPI(`/history?limit=${limit}`);
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI('/health');
}

/**
 * Discover circuit - find key attention heads
 */
export async function discoverCircuit(
  request: CircuitDiscoveryRequest
): Promise<{
  heads: { layer: number; head: number; importance: number }[];
  connections: { from: string; to: string; weight: number }[];
}> {
  return fetchAPI('/discover-circuit', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Quick deception check
 */
export async function checkDeception(
  request: DeceptionCheckRequest
): Promise<DeceptionResult> {
  return fetchAPI('/deception/quick-check', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
