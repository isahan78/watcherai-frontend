// Request types
export interface AnalysisRequest {
  prompt: string;
  output: string;
}

// Backend API Response types (actual structure from API)
export interface BackendAnalysisResponse {
  summary: {
    confidence: number;
    risk_level: 'low' | 'medium' | 'high';
    pattern_type: string;
    complexity: number;
  };
  explanation: {
    short: string;
    detailed: string;
    reasoning_type: string;
  };
  key_components: {
    id: string;
    importance: number;
    label: string;
    description: string;
  }[];
  information_flow: {
    summary: string;
    edges: {
      from: string;
      to: string;
      strength: 'weak' | 'medium' | 'strong';
    }[];
  };
  risk_assessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendation: string;
  };
  metadata: {
    analysis_time_ms: number;
    model_analyzed: string;
    num_heads_analyzed: number;
    num_edges: number;
  };
}

// Frontend types (transformed from backend)
export interface HeadComponent {
  layer: number;
  head: number;
  id: string;           // e.g., "L6H15"
  importance: number;   // 0-1 scale
  label: string;        // e.g., "Location encoder"
}

export interface FlowConnection {
  from: string;
  to: string;
  weight: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  prompt: string;
  output: string;

  // Top-level metrics
  metrics: {
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    keyHeadsCount: number;
    complexity: number;
  };

  // Human-readable explanation
  explanation: string;

  // Key components (attention heads)
  keyComponents: HeadComponent[];

  // Information flow between components
  informationFlow: {
    connections: FlowConnection[];
    description: string;
  };

  // Potential concerns / risk factors
  concerns: {
    type: 'safe' | 'warning' | 'danger';
    message: string;
  }[];

  // Additional metadata
  metadata: {
    analysisTimeMs: number;
    modelAnalyzed: string;
    recommendation: string;
  };
}

// History types
export interface BackendHistoryResponse {
  items: {
    request_id: string;
    prompt: string;
    response: string;
    timestamp: string;
    risk_level: 'low' | 'medium' | 'high';
    confidence: number;
  }[];
  total: number;
  limit: number;
  offset: number;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  promptPreview: string;
  outputPreview: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

// Health check
export interface HealthResponse {
  status: string;
  glassbox_connected: boolean;
  database_connected: boolean;
}
