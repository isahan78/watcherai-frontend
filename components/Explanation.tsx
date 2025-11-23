import { AnalysisResult } from '@/lib/types';
import InfluenceBars from './InfluenceBars';
import SafetyBadge from './SafetyBadge';

interface ExplanationProps {
  result: AnalysisResult;
}

export default function Explanation({ result }: ExplanationProps) {
  return (
    <div className="space-y-8">
      {/* Header with Safety Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">
            Analysis Complete
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <SafetyBadge
          label={result.safety.label}
          score={result.safety.score}
        />
      </div>

      {/* Summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-3">
          Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {result.summary}
        </p>

        {/* Confidence */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Confidence:</span>
          <div className="flex-1 max-w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
      </section>

      {/* Token Influence */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          What Influenced This Output
        </h2>
        <InfluenceBars tokens={result.tokenInfluence} />
      </section>

      {/* Key Factors */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Key Factors
        </h2>
        <ul className="space-y-2">
          {result.keyFactors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-gray-700">{factor}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Deeper Insights */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Deeper Insights
        </h2>
        <div className="space-y-4">
          {result.insights.map((insight, i) => (
            <div key={i} className="border-l-2 border-primary/30 pl-4">
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Concerns (if any) */}
      {result.safety.concerns.length > 0 && (
        <section className="bg-warning/5 rounded-xl border border-warning/20 p-6">
          <h2 className="text-lg font-medium text-warning mb-3">
            Safety Notes
          </h2>
          <ul className="space-y-2">
            {result.safety.concerns.map((concern, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-warning">⚠</span>
                {concern}
              </li>
            ))}
          </ul>
        </section>
      )}

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
    </div>
  );
}
