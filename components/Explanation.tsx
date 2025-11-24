import { AnalysisResult } from '@/lib/types';
import MetricsGrid from './MetricsGrid';
import KeyComponents from './KeyComponents';
import InformationFlow from './InformationFlow';
import PotentialConcerns from './PotentialConcerns';

interface ExplanationProps {
  result: AnalysisResult;
}

export default function Explanation({ result }: ExplanationProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-secondary">
          Analysis Results
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid
        confidence={result.metrics.confidence}
        riskLevel={result.metrics.riskLevel}
        keyHeadsCount={result.metrics.keyHeadsCount}
        complexity={result.metrics.complexity}
      />

      {/* Explanation Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-3 flex items-center gap-2">
          <span>📝</span>
          EXPLANATION
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {result.explanation}
        </p>
      </section>

      {/* Key Components */}
      <KeyComponents components={result.keyComponents} />

      {/* Information Flow */}
      <InformationFlow
        connections={result.informationFlow.connections}
        description={result.informationFlow.description}
      />

      {/* Potential Concerns */}
      <PotentialConcerns concerns={result.concerns} />

      {/* Original Input/Output */}
      <section className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Original Input & Output
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Prompt</h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {result.prompt}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Output</h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm">
              {result.output}
            </p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium flex items-center gap-2">
          <span>📊</span>
          View Full Circuit
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
          <span>📥</span>
          Export JSON
        </button>
      </div>
    </div>
  );
}
