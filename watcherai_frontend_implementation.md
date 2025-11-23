# WatcherAI Frontend MVP - Implementation Plan

> **One job done well:** Let users understand *why* an AI said what it said.

---

## Project Overview

WatcherAI Frontend is a minimal Next.js application that provides a clean interface for AI explainability. Users paste a prompt and model output, click "Explain," and receive an intuitive breakdown of how the AI arrived at its response.

### Core Features (MVP)
- Paste prompt + output → Get explanation
- View token influence visualization
- See safety/confidence badge
- Browse analysis history

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React hooks (no external state management)
- **API:** REST calls to WatcherAI Backend

---

## Folder Structure

```
watcherai-frontend/
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Home page (/)
│   ├── analyze/
│   │   └── page.tsx            # Analysis input page (/analyze)
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx        # Results page (/results/[id])
│   ├── history/
│   │   └── page.tsx            # History page (/history)
│   └── globals.css             # Global styles
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   ├── InputForm.tsx           # Prompt/output input form
│   ├── Explanation.tsx         # Main explanation display
│   ├── InfluenceBars.tsx       # Token influence visualization
│   ├── SafetyBadge.tsx         # Safety/confidence indicator
│   ├── LoadingSpinner.tsx      # Loading state
│   └── HistoryCard.tsx         # History list item
├── lib/
│   ├── api.ts                  # API client functions
│   └── types.ts                # TypeScript interfaces
├── public/
│   └── logo.svg                # WatcherAI logo
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.local                  # Environment variables
```

---

## Step-by-Step Setup

### 1. Create Next.js Project

```bash
npx create-next-app@latest watcherai-frontend --typescript --tailwind --eslint --app --src-dir=false
cd watcherai-frontend
```

### 2. Install Dependencies

```bash
npm install clsx
```

### 3. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Configure Tailwind

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#1A1A2E',
        accent: '#00D9FF',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

### 5. Add Global Styles

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  @apply bg-gray-50 text-gray-900 antialiased;
}

/* Smooth transitions */
* {
  @apply transition-colors duration-150;
}
```

---

## TypeScript Types

Create `lib/types.ts`:

```typescript
export interface AnalysisRequest {
  prompt: string;
  output: string;
  model?: string;
}

export interface TokenInfluence {
  token: string;
  influence: number;  // 0-1 scale
  position: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  prompt: string;
  output: string;

  // Summary
  summary: string;
  confidence: number;  // 0-1

  // Safety assessment
  safety: {
    score: number;     // 0-1, higher = safer
    label: 'safe' | 'caution' | 'warning';
    concerns: string[];
  };

  // Token influence
  tokenInfluence: TokenInfluence[];

  // Deeper insights
  insights: {
    title: string;
    description: string;
  }[];

  // Key attention patterns
  keyFactors: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  promptPreview: string;
  outputPreview: string;
  safetyLabel: 'safe' | 'caution' | 'warning';
}
```

---

## API Client

Create `lib/api.ts`:

```typescript
import { AnalysisRequest, AnalysisResult, HistoryItem } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      response.status,
      error.detail || 'An error occurred'
    );
  }

  return response.json();
}

/**
 * Submit prompt and output for analysis
 */
export async function analyze(
  request: AnalysisRequest
): Promise<{ id: string }> {
  return fetchAPI('/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get analysis results by ID
 */
export async function getAnalysis(id: string): Promise<AnalysisResult> {
  return fetchAPI(`/analysis/${id}`);
}

/**
 * Get analysis history
 */
export async function getHistory(
  limit: number = 20
): Promise<HistoryItem[]> {
  return fetchAPI(`/history?limit=${limit}`);
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI('/health');
}
```

---

## Components

### Navbar.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/analyze', label: 'Analyze' },
  { href: '/history', label: 'History' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-lg text-secondary">
              WatcherAI
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### InputForm.tsx

```tsx
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
          placeholder="Enter the prompt you gave to the AI..."
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
          placeholder="Paste the AI's response here..."
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
          'Explain This Output'
        )}
      </button>
    </form>
  );
}
```

### Explanation.tsx

```tsx
import { AnalysisResult } from '@/lib/types';
import InfluenceBars from './InfluenceBars';
import SafetyBadge from './SafetyBadge';

interface ExplanationProps {
  result: AnalysisResult;
}

export default function Explanation({ result }: ExplanationProps) {
  return (
    <div className="space-y-8">
      {/* Header with Safety Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">
            Analysis Complete
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <SafetyBadge
          label={result.safety.label}
          score={result.safety.score}
        />
      </div>

      {/* Summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-3">
          Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {result.summary}
        </p>

        {/* Confidence */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Confidence:</span>
          <div className="flex-1 max-w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
      </section>

      {/* Token Influence */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          What Influenced This Output
        </h2>
        <InfluenceBars tokens={result.tokenInfluence} />
      </section>

      {/* Key Factors */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Key Factors
        </h2>
        <ul className="space-y-2">
          {result.keyFactors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-gray-700">{factor}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Deeper Insights */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Deeper Insights
        </h2>
        <div className="space-y-4">
          {result.insights.map((insight, i) => (
            <div key={i} className="border-l-2 border-primary/30 pl-4">
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Concerns (if any) */}
      {result.safety.concerns.length > 0 && (
        <section className="bg-warning/5 rounded-xl border border-warning/20 p-6">
          <h2 className="text-lg font-medium text-warning mb-3">
            Safety Notes
          </h2>
          <ul className="space-y-2">
            {result.safety.concerns.map((concern, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-warning">⚠</span>
                {concern}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Original Input/Output */}
      <section className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Original Input & Output
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Prompt</h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {result.prompt}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Output</h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm">
              {result.output}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### InfluenceBars.tsx

```tsx
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
```

### SafetyBadge.tsx

```tsx
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
```

### LoadingSpinner.tsx

```tsx
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={clsx(
        'rounded-full border-gray-200 border-t-primary animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
}
```

### HistoryCard.tsx

```tsx
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
```

---

## Pages

### app/layout.tsx

```tsx
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'WatcherAI - Understand AI Decisions',
  description: 'See why AI models produce specific outputs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
```

### app/page.tsx (Home)

```tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      {/* Hero */}
      <h1 className="text-4xl font-bold text-secondary mb-4">
        Understand AI Decisions
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Paste any AI output and instantly see why the model responded that way.
      </p>

      {/* CTA */}
      <Link
        href="/analyze"
        className="inline-flex items-center gap-2 px-8 py-4
                   bg-primary text-white font-medium rounded-xl
                   hover:bg-primary/90 transition-colors text-lg"
      >
        Get Started
        <span>→</span>
      </Link>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-primary text-xl">📊</span>
          </div>
          <h3 className="font-semibold text-secondary mb-2">
            Token Influence
          </h3>
          <p className="text-gray-600 text-sm">
            See which parts of your prompt most influenced the output.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-success text-xl">✓</span>
          </div>
          <h3 className="font-semibold text-secondary mb-2">
            Safety Check
          </h3>
          <p className="text-gray-600 text-sm">
            Instant safety assessment for any AI response.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-accent text-xl">💡</span>
          </div>
          <h3 className="font-semibold text-secondary mb-2">
            Deep Insights
          </h3>
          <p className="text-gray-600 text-sm">
            Understand the reasoning patterns behind AI decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### app/analyze/page.tsx

```tsx
import InputForm from '@/components/InputForm';

export default function AnalyzePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-secondary mb-2">
          Analyze AI Output
        </h1>
        <p className="text-gray-600">
          Paste the prompt and output to understand how the AI arrived at its response.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <InputForm />
      </div>
    </div>
  );
}
```

### app/results/[id]/page.tsx

```tsx
import { getAnalysis } from '@/lib/api';
import Explanation from '@/components/Explanation';
import Link from 'next/link';

interface ResultsPageProps {
  params: { id: string };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  try {
    const result = await getAnalysis(params.id);

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
  } catch (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-danger mb-4">
          Analysis Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          This analysis may have expired or doesn't exist.
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
```

### app/history/page.tsx

```tsx
import { getHistory } from '@/lib/api';
import HistoryCard from '@/components/HistoryCard';
import Link from 'next/link';

export default async function HistoryPage() {
  const history = await getHistory(20);

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
```

---

## Styling Guidelines

### Design Principles

1. **Clean & Minimal**: White backgrounds, subtle borders, generous spacing
2. **Clear Hierarchy**: Use font weights and sizes to guide attention
3. **Consistent Colors**: Primary blue for actions, semantic colors for status
4. **Responsive**: Mobile-first, works on all screen sizes

### Color Usage

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0066FF` | CTAs, links, highlights |
| Secondary | `#1A1A2E` | Headings, important text |
| Accent | `#00D9FF` | Secondary highlights |
| Success | `#10B981` | Safe status, positive |
| Warning | `#F59E0B` | Caution, attention needed |
| Danger | `#EF4444` | Errors, warnings |

### Spacing Scale

- Use Tailwind's default spacing: `4`, `6`, `8`, `12`, `16`, `20`
- Cards: `p-6` or `p-8`
- Sections: `space-y-8`
- Max content width: `max-w-3xl` or `max-w-5xl`

### Typography

- Headings: `font-semibold` or `font-bold`
- Body: `text-gray-700`
- Secondary: `text-gray-500` or `text-gray-600`
- Code/Tokens: `font-mono`, `bg-gray-100`

---

## Deployment to Vercel

### 1. Prepare Repository

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
gh repo create watcherai-frontend --public
git push -u origin main
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect via Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Select `watcherai-frontend`
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy

### 3. Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.watcherai.com
```

### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.watcherai.com`)
3. Update DNS records as instructed

---

## Backend Requirements

The WatcherAI Backend should implement these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/analyze` | POST | Submit analysis, returns `{ id }` |
| `/analysis/{id}` | GET | Get analysis result |
| `/history` | GET | List past analyses |

The backend wraps GlassBox and should:
1. Accept prompt + output
2. Run trace with GlassBox
3. Generate summary and insights
4. Calculate safety score
5. Return structured `AnalysisResult`

---

## MVP Checklist

- [ ] Project setup with Next.js 14
- [ ] Tailwind configuration
- [ ] All 4 pages implemented
- [ ] All 7 components working
- [ ] API client connecting to backend
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsive
- [ ] Deployed to Vercel

---

## Future Enhancements (Post-MVP)

1. **Authentication**: User accounts, saved analyses
2. **Comparison View**: Compare two outputs side-by-side
3. **Export**: Download analysis as PDF
4. **API Keys**: Allow programmatic access
5. **Dark Mode**: Theme toggle
6. **Real-time**: WebSocket for live analysis progress

---

*This document describes the complete MVP implementation. Start simple, ship fast, iterate based on user feedback.*
