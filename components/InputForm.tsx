'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyze } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';

export default function InputForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || !output.trim()) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { id } = await analyze({ prompt, output });
      router.push(`/results/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt Input */}
      <div>
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Where is the Eiffel Tower located?"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-primary/50 focus:border-primary
                     placeholder:text-gray-400 resize-none"
          disabled={loading}
        />
      </div>

      {/* Output Input */}
      <div>
        <label
          htmlFor="output"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          AI Output
        </label>
        <textarea
          id="output"
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="The Eiffel Tower is located in Paris, France."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-primary/50 focus:border-primary
                     placeholder:text-gray-400 resize-none font-mono text-sm"
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-primary text-white font-medium
                   rounded-lg hover:bg-primary/90 disabled:opacity-50
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            Analyzing...
          </>
        ) : (
          <>
            <span>🔍</span>
            Analyze Response
          </>
        )}
      </button>
    </form>
  );
}
