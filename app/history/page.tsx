'use client';

import { useEffect, useState } from 'react';
import { getHistory } from '@/lib/api';
import HistoryCard from '@/components/HistoryCard';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HistoryItem } from '@/lib/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getHistory(20);
        setHistory(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

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

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Unable to load history</p>
          <p className="text-sm text-gray-400 mb-4">
            Make sure the backend API is running
          </p>
          <Link
            href="/analyze"
            className="text-primary hover:underline"
          >
            Run a new analysis
          </Link>
        </div>
      ) : history.length === 0 ? (
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
