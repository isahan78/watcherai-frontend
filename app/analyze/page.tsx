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
