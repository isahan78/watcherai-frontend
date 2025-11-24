import { HeadComponent } from '@/lib/types';
import clsx from 'clsx';

interface KeyComponentsProps {
  components: HeadComponent[];
  maxDisplay?: number;
}

export default function KeyComponents({
  components,
  maxDisplay = 8,
}: KeyComponentsProps) {
  const sortedComponents = [...components]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, maxDisplay);

  const maxImportance = Math.max(...sortedComponents.map((c) => c.importance));

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-secondary mb-4 flex items-center gap-2">
        <span>🧠</span>
        KEY COMPONENTS
        <span className="text-sm font-normal text-gray-500">
          (what drove this response)
        </span>
      </h2>

      <div className="space-y-3">
        {sortedComponents.map((component) => {
          const width = (component.importance / maxImportance) * 100;

          return (
            <div key={component.id} className="flex items-center gap-3">
              {/* Head ID */}
              <div className="w-16 flex-shrink-0">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                  {component.id}
                </code>
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    component.importance > 0.8
                      ? 'bg-primary'
                      : component.importance > 0.5
                      ? 'bg-accent'
                      : 'bg-gray-400'
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>

              {/* Percentage */}
              <span className="w-12 text-sm text-gray-600 text-right font-medium">
                {Math.round(component.importance * 100)}%
              </span>

              {/* Label */}
              <span className="w-32 text-sm text-gray-500 truncate hidden sm:block">
                {component.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile labels */}
      <div className="mt-4 sm:hidden">
        <div className="text-xs text-gray-500 space-y-1">
          {sortedComponents.slice(0, 4).map((component) => (
            <div key={component.id} className="flex justify-between">
              <span className="font-mono">{component.id}</span>
              <span>{component.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
