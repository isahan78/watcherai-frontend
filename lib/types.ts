// Request types
export interface AnalysisRequest {
  prompt: string;
  response: string;  // Backend expects "response" not "output"
}

// Backend API Response types
export interface BackendAnalysisResponse {
  request_id: string;
  summary: {
    confidence: number;
    complexity: number;
    total_components: number;
    primary_pattern: string;
  };
  components: {
    layer: number;
    head: number;
    importance: number;
    role: string;
    description: string;
  }[];
  information_flow: {
    connections: {
      from_layer: number;
      from_head: number;
      to_layer: number;
      to_head: number;
      weight: number;
    }[];
    description: string;
  };
  risk_assessment: {
    level: 'low' | 'medium' | 'high';
    concerns: {
      type: 'safe' | 'warning' | 'danger';
      message: string;
    }[];
  };
  explanation: {
    summary: string;
    details: string;
  };
  metadata: {
    model: string;
    timestamp: string;
    processing_time_ms: number;
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
  from: string;         // e.g., "L6H15"
  to: string;           // e.g., "L8H15"
  weight: number;       // connection strength
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  prompt: string;
  output: string;

  // Top-level metrics
  metrics: {
    confidence: number;      // 0-1, displayed as percentage
    riskLevel: 'low' | 'medium' | 'high';
    keyHeadsCount: number;
    complexity: number;      // 0-1, displayed as percentage
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

  // Potential concerns / deception check
  concerns: {
    type: 'safe' | 'warning' | 'danger';
    message: string;
  }[];
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
