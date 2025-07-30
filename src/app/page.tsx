'use client';

import { useState } from 'react';

interface AnalysisResult {
  environmental: string;
  social: string;
  governance: string;
  score: number;
  summary: string;
  sentiment: {
    environmental: {
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      confidence: number;
    };
    social: {
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      confidence: number;
    };
    governance: {
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      confidence: number;
    };
    overall: {
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      confidence: number;
    };
  };
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
                className="w-full px-4 py-2 !text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <h2 className="text-2xl text-black-700 font-semibold mb-4">Analysis Results</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-black-700 font-medium mb-2">Environmental Factors</h3>
                <p className="text-black-700">{analysis.environmental}</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Sentiment Analysis:</p>
                  <p className="text-sm">
                    Sentiment: <span className={`font-semibold ${
                      analysis.sentiment.environmental.sentiment === 'positive' ? 'text-green-600' :
                      analysis.sentiment.environmental.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{analysis.sentiment.environmental.sentiment}</span>
                    {' | '}
                    Confidence: {(analysis.sentiment.environmental.confidence * 100).toFixed(1)}%
                    {' | '}
                    Score: {(analysis.sentiment.environmental.score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Social Factors</h3>
                <p className="text-black-700">{analysis.social}</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Sentiment Analysis:</p>
                  <p className="text-sm">
                    Sentiment: <span className={`font-semibold ${
                      analysis.sentiment.social.sentiment === 'positive' ? 'text-green-600' :
                      analysis.sentiment.social.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{analysis.sentiment.social.sentiment}</span>
                    {' | '}
                    Confidence: {(analysis.sentiment.social.confidence * 100).toFixed(1)}%
                    {' | '}
                    Score: {(analysis.sentiment.social.score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Governance Factors</h3>
                <p className="text-black-700">{analysis.governance}</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Sentiment Analysis:</p>
                  <p className="text-sm">
                    Sentiment: <span className={`font-semibold ${
                      analysis.sentiment.governance.sentiment === 'positive' ? 'text-green-600' :
                      analysis.sentiment.governance.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{analysis.sentiment.governance.sentiment}</span>
                    {' | '}
                    Confidence: {(analysis.sentiment.governance.confidence * 100).toFixed(1)}%
                    {' | '}
                    Score: {(analysis.sentiment.governance.score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Overall Score</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {analysis.score}
                    </span>
                  </div>
                  <p className="ml-4 text-black">{analysis.summary}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Overall Sentiment Analysis</h3>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold">Overall Sentiment:</span>
                    <span className={`px-3 py-1 rounded-full text-white font-medium ${
                      analysis.sentiment.overall.sentiment === 'positive' ? 'bg-green-500' :
                      analysis.sentiment.overall.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {analysis.sentiment.overall.sentiment.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Confidence:</span>
                      <span className="ml-2">{(analysis.sentiment.overall.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Sentiment Score:</span>
                      <span className="ml-2">{(analysis.sentiment.overall.score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
