import { TokenInfluence } from '@/lib/types';
import clsx from 'clsx';

interface InfluenceBarsProps {
  tokens: TokenInfluence[];
  maxDisplay?: number;
}

export default function InfluenceBars({
  tokens,
  maxDisplay = 10
}: InfluenceBarsProps) {
  // Sort by influence and take top N
  const sortedTokens = [...tokens]
    .sort((a, b) => b.influence - a.influence)
    .slice(0, maxDisplay);

  const maxInfluence = Math.max(...sortedTokens.map(t => t.influence));

  return (
    <div className="space-y-3">
      {sortedTokens.map((token, i) => {
        const width = (token.influence / maxInfluence) * 100;
        const intensity = token.influence;

        return (
          <div key={i} className="flex items-center gap-3">
            {/* Token label */}
            <div className="w-24 flex-shrink-0">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono truncate block">
                {token.token}
              </code>
            </div>

            {/* Bar */}
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-500',
                  intensity > 0.7 ? 'bg-primary' :
                  intensity > 0.4 ? 'bg-accent' :
                  'bg-gray-400'
                )}
                style={{ width: `${width}%` }}
              />
            </div>

            {/* Percentage */}
            <span className="w-12 text-sm text-gray-600 text-right">
              {Math.round(token.influence * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
