import { getAnalysis } from '@/lib/api';
import Explanation from '@/components/Explanation';
import Link from 'next/link';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;

  try {
    const result = await getAnalysis(id);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Explanation result={result} />

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/analyze"
            className="px-6 py-3 bg-primary text-white rounded-lg
                       hover:bg-primary/90 font-medium"
          >
            Analyze Another
          </Link>
          <Link
            href="/history"
            className="px-6 py-3 border border-gray-300 rounded-lg
                       hover:bg-gray-50 font-medium text-gray-700"
          >
            View History
          </Link>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-danger mb-4">
          Analysis Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          This analysis may have expired or doesn&apos;t exist.
        </p>
        <Link
          href="/analyze"
          className="inline-flex px-6 py-3 bg-primary text-white
                     rounded-lg hover:bg-primary/90 font-medium"
        >
          Start New Analysis
        </Link>
      </div>
    );
  }
}
