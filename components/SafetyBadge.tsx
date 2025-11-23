import clsx from 'clsx';

interface SafetyBadgeProps {
  label: 'safe' | 'caution' | 'warning';
  score: number;
}

const config = {
  safe: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    icon: '✓',
    label: 'Safe',
  },
  caution: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    icon: '⚠',
    label: 'Caution',
  },
  warning: {
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    text: 'text-danger',
    icon: '✕',
    label: 'Warning',
  },
};

export default function SafetyBadge({ label, score }: SafetyBadgeProps) {
  const styles = config[label];

  return (
    <div
      className={clsx(
        'px-4 py-2 rounded-full border flex items-center gap-2',
        styles.bg,
        styles.border
      )}
    >
      <span className={styles.text}>{styles.icon}</span>
      <span className={clsx('font-medium text-sm', styles.text)}>
        {styles.label}
      </span>
      <span className="text-xs text-gray-500">
        ({Math.round(score * 100)}%)
      </span>
    </div>
  );
}
