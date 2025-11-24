export interface AnalysisRequest {
  prompt: string;
  output: string;
  model?: string;
}

// Circuit Discovery types
export interface CircuitDiscoveryRequest {
  clean_input: string;
  corrupted_input: string;
  task_description?: string;
  max_heads?: number;
  include_mlp?: boolean;
}

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

// Deception check types
export interface DeceptionCheckRequest {
  prompt: string;
  response: string;
}

export interface DeceptionResult {
  hasDeceptionSignals: boolean;
  confidence: number;
  concerns: {
    type: 'safe' | 'warning' | 'danger';
    message: string;
  }[];
}

// Main analysis result
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

  // Legacy fields for backward compatibility
  summary?: string;
  confidence?: number;
  safety?: {
    score: number;
    label: 'safe' | 'caution' | 'warning';
    concerns: string[];
  };
  tokenInfluence?: TokenInfluence[];
  insights?: {
    title: string;
    description: string;
  }[];
  keyFactors?: string[];
}

export interface TokenInfluence {
  token: string;
  influence: number;
  position: number;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  promptPreview: string;
  outputPreview: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}
