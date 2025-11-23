import { getHistory } from '@/lib/api';
import HistoryCard from '@/components/HistoryCard';
import Link from 'next/link';

export default async function HistoryPage() {
  let history: Awaited<ReturnType<typeof getHistory>> = [];

  try {
    history = await getHistory(20);
  } catch {
    // History fetch failed, show empty state
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-secondary">
          Analysis History
        </h1>
        <Link
          href="/analyze"
          className="px-4 py-2 bg-primary text-white rounded-lg
                     hover:bg-primary/90 text-sm font-medium"
        >
          New Analysis
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No analyses yet</p>
          <Link
            href="/analyze"
            className="text-primary hover:underline"
          >
            Run your first analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
