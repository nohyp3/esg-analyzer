'use client';

import { useState } from 'react';

interface AnalysisResult {
  environmental: string;
  social: string;
  governance: string;
  score: number;
  summary: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze URL');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze the URL. Please make sure it\'s a valid ESG page.';
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">ESG Content Analyzer</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                ESG Page URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/esg"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze ESG Content'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Environmental Factors</h3>
                <p className="text-gray-700">{analysis.environmental}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Social Factors</h3>
                <p className="text-gray-700">{analysis.social}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Governance Factors</h3>
                <p className="text-gray-700">{analysis.governance}</p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Overall Score</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {analysis.score}
                    </span>
                  </div>
                  <p className="ml-4 text-gray-600">{analysis.summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
