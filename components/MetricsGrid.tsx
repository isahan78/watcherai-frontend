import clsx from 'clsx';

interface MetricsGridProps {
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  keyHeadsCount: number;
  complexity: number;
}

const riskConfig = {
  low: { bg: 'bg-success/10', text: 'text-success', label: 'Low' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium' },
  high: { bg: 'bg-danger/10', text: 'text-danger', label: 'High' },
};

export default function MetricsGrid({
  confidence,
  riskLevel,
  keyHeadsCount,
  complexity,
}: MetricsGridProps) {
  const risk = riskConfig[riskLevel];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Confidence */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-primary">
          {Math.round(confidence * 100)}%
        </div>
        <div className="text-sm text-gray-500 mt-1">Confidence</div>
      </div>

      {/* Risk Level */}
      <div className={clsx('rounded-xl border p-4 text-center', risk.bg, 'border-transparent')}>
        <div className={clsx('text-2xl font-bold', risk.text)}>
          {risk.label}
        </div>
        <div className="text-sm text-gray-500 mt-1">Risk</div>
      </div>

      {/* Key Heads */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-secondary">
          {keyHeadsCount}
        </div>
        <div className="text-sm text-gray-500 mt-1">Key Heads</div>
      </div>

      {/* Complexity */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-accent">
          {(complexity * 100).toFixed(1)}%
        </div>
        <div className="text-sm text-gray-500 mt-1">Complexity</div>
      </div>
    </div>
  );
}
