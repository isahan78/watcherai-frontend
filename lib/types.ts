export interface AnalysisRequest {
  prompt: string;
  output: string;
  model?: string;
}

export interface TokenInfluence {
  token: string;
  influence: number;  // 0-1 scale
  position: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  prompt: string;
  output: string;

  // Summary
  summary: string;
  confidence: number;  // 0-1

  // Safety assessment
  safety: {
    score: number;     // 0-1, higher = safer
    label: 'safe' | 'caution' | 'warning';
    concerns: string[];
  };

  // Token influence
  tokenInfluence: TokenInfluence[];

  // Deeper insights
  insights: {
    title: string;
    description: string;
  }[];

  // Key attention patterns
  keyFactors: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  promptPreview: string;
  outputPreview: string;
  safetyLabel: 'safe' | 'caution' | 'warning';
}
