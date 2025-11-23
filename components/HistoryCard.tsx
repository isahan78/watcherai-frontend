import Link from 'next/link';
import { HistoryItem } from '@/lib/types';
import SafetyBadge from './SafetyBadge';

interface HistoryCardProps {
  item: HistoryItem;
}

export default function HistoryCard({ item }: HistoryCardProps) {
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

          {/* Timestamp */}
          <p className="text-gray-400 text-xs mt-2">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Safety badge */}
        <SafetyBadge label={item.safetyLabel} score={1} />
      </div>
    </Link>
  );
}
