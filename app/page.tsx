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
