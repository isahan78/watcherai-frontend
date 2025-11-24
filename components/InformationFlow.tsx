import { FlowConnection } from '@/lib/types';

interface InformationFlowProps {
  connections: FlowConnection[];
  description: string;
}

export default function InformationFlow({
  connections,
  description,
}: InformationFlowProps) {
  // Build a simple visual representation of the flow
  const sortedConnections = [...connections].sort((a, b) => b.weight - a.weight);

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-secondary mb-4 flex items-center gap-2">
        <span>🔗</span>
        INFORMATION FLOW
      </h2>

      {/* Flow diagram - simplified text representation */}
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="flex flex-wrap items-center gap-2">
          {sortedConnections.slice(0, 5).map((conn, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                {conn.from}
              </span>
              <span className="text-gray-400">
                ──({conn.weight.toFixed(2)})──&gt;
              </span>
              {i === sortedConnections.length - 1 || i === 4 ? (
                <span className="bg-accent/10 text-accent px-2 py-1 rounded">
                  {conn.to}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mt-4 leading-relaxed">{description}</p>

      {/* Connection details */}
      {connections.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Connection Strengths
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sortedConnections.slice(0, 6).map((conn, i) => (
              <div
                key={i}
                className="text-xs bg-gray-50 rounded px-2 py-1 flex justify-between"
              >
                <span className="font-mono">
                  {conn.from} → {conn.to}
                </span>
                <span className="text-gray-500">{conn.weight.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
