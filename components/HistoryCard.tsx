import Link from 'next/link';
import { HistoryItem } from '@/lib/types';
import clsx from 'clsx';

interface HistoryCardProps {
  item: HistoryItem;
}

const riskConfig = {
  low: { bg: 'bg-success/10', text: 'text-success', label: 'Low Risk' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium Risk' },
  high: { bg: 'bg-danger/10', text: 'text-danger', label: 'High Risk' },
};

export default function HistoryCard({ item }: HistoryCardProps) {
  const risk = riskConfig[item.riskLevel];

  return (
    <Link
      href={`/results/${item.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5
                 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Prompt preview */}
          <p className="text-gray-900 font-medium truncate">
            {item.promptPreview}
          </p>

          {/* Output preview */}
          <p className="text-gray-500 text-sm mt-1 truncate font-mono">
            {item.outputPreview}
          </p>

          {/* Timestamp and confidence */}
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-400 text-xs">
              {new Date(item.timestamp).toLocaleString()}
            </p>
            <span className="text-gray-300">|</span>
            <p className="text-xs text-gray-500">
              {Math.round(item.confidence * 100)}% confidence
            </p>
          </div>
        </div>

        {/* Risk badge */}
        <div
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium flex-shrink-0',
            risk.bg,
            risk.text
          )}
        >
          {risk.label}
        </div>
      </div>
    </Link>
  );
}
