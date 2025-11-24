import clsx from 'clsx';

interface Concern {
  type: 'safe' | 'warning' | 'danger';
  message: string;
}

interface PotentialConcernsProps {
  concerns: Concern[];
}

const iconConfig = {
  safe: { icon: '✓', bg: 'bg-success/10', text: 'text-success' },
  warning: { icon: '⚠', bg: 'bg-warning/10', text: 'text-warning' },
  danger: { icon: '✕', bg: 'bg-danger/10', text: 'text-danger' },
};

export default function PotentialConcerns({ concerns }: PotentialConcernsProps) {
  // If no concerns, show all-clear message
  const hasConcerns = concerns.some((c) => c.type !== 'safe');

  return (
    <section
      className={clsx(
        'rounded-xl border p-6',
        hasConcerns
          ? 'bg-warning/5 border-warning/20'
          : 'bg-success/5 border-success/20'
      )}
    >
      <h2 className="text-lg font-medium text-secondary mb-4 flex items-center gap-2">
        <span>⚠️</span>
        POTENTIAL CONCERNS
      </h2>

      <ul className="space-y-3">
        {concerns.map((concern, i) => {
          const config = iconConfig[concern.type];
          return (
            <li key={i} className="flex items-start gap-3">
              <span
                className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                  config.bg
                )}
              >
                <span className={config.text}>{config.icon}</span>
              </span>
              <span className="text-gray-700">{concern.message}</span>
            </li>
          );
        })}
      </ul>

      {!hasConcerns && (
        <p className="text-sm text-success mt-4">
          All checks passed. No significant concerns detected.
        </p>
      )}
    </section>
  );
}
