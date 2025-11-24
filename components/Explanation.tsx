'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types';
import MetricsGrid from './MetricsGrid';
import KeyComponents from './KeyComponents';
import InformationFlow from './InformationFlow';
import PotentialConcerns from './PotentialConcerns';

interface ExplanationProps {
  result: AnalysisResult;
}

export default function Explanation({ result }: ExplanationProps) {
  const [showFullCircuit, setShowFullCircuit] = useState(false);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `watcherai-analysis-${result.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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
        <button
          onClick={() => setShowFullCircuit(!showFullCircuit)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium flex items-center gap-2"
        >
          <span>📊</span>
          {showFullCircuit ? 'Hide Full Circuit' : 'View Full Circuit'}
        </button>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2"
        >
          <span>📥</span>
          Export JSON
        </button>
      </div>

      {/* Full Circuit Details (Expanded) */}
      {showFullCircuit && (
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-secondary mb-4 flex items-center gap-2">
            <span>🔬</span>
            FULL CIRCUIT DETAILS
          </h2>

          {/* All Components */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              All Attention Heads ({result.keyComponents.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {result.keyComponents.map((comp, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg p-2 text-xs"
                >
                  <div className="font-mono font-medium text-primary">
                    {comp.id}
                  </div>
                  <div className="text-gray-500 truncate">{comp.label}</div>
                  <div className="text-gray-700">
                    {Math.round(comp.importance * 100)}% importance
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Connections */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              All Connections ({result.informationFlow.connections.length})
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left pb-2">From</th>
                    <th className="text-left pb-2">To</th>
                    <th className="text-right pb-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {result.informationFlow.connections.map((conn, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="py-1 font-mono">{conn.from}</td>
                      <td className="py-1 font-mono">{conn.to}</td>
                      <td className="py-1 text-right">{conn.weight.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metadata */}
          {result.metadata && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Analysis Metadata
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-500">Model Analyzed:</div>
                  <div className="text-gray-700">{result.metadata.modelAnalyzed}</div>
                  <div className="text-gray-500">Processing Time:</div>
                  <div className="text-gray-700">{result.metadata.analysisTimeMs.toFixed(0)}ms</div>
                  <div className="text-gray-500">Recommendation:</div>
                  <div className="text-gray-700 col-span-2 mt-1">{result.metadata.recommendation}</div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
