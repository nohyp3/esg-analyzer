'use client';

import { useState } from 'react';
// Add a type for negative snippets per category
interface NegativeSnippets {
  environmental: string[];
  social: string[];
  governance: string[];
}

// Extend AnalysisResult to include negativeSnippets
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
  negativeSnippets: NegativeSnippets;
}


export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze content';
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-[#9ad5ca]">
      <div className="max-w-4xl mx-auto">
        {/* <h1 className="text-4xl font-bold text-gray-800 mb-8">ESG Content Analyzer</h1> */}


        {/* Main ESG Analysis Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">ESG Content Analysis</h2>
              <p className="text-sm text-gray-500">Comprehensive Environmental, Social & Governance Analysis</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Input Content</p>
                  <p className="text-gray-600">Paste text or enter a URL to analyze</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 font-semibold text-xs">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">AI Analysis</p>
                  <p className="text-gray-600">TensorFlow analyzes sentiment & ESG factors</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-purple-600 font-semibold text-xs">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Get Results</p>
                  <p className="text-gray-600">Receive scores, insights & recommendations</p>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ESG Content or URL
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your ESG report, sustainability statement, URL, or any content related to Environmental, Social, and Governance factors..."
                  className="w-full px-4 py-3 pl-12 !text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={8}
                  required
                />
                <div className="absolute top-3 left-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b744b8] cursor-pointer text-white py-3 px-4 rounded-md hover:bg-[#a379c9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing ESG Content...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analyze ESG Content
                </>
              )}
            </button>
          </form>
          
          {/* Examples and Tips */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Examples & Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">📄 Text Content:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Sustainability reports</li>
                  <li>• Corporate ESG statements</li>
                  <li>• Environmental policies</li>
                  <li>• Social responsibility documents</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">🌐 URLs:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Company sustainability pages</li>
                  <li>• ESG disclosure websites</li>
                  <li>• Corporate responsibility sections</li>
                  <li>• Environmental impact reports</li>
                </ul>
              </div>
            </div>
          </div>
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
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">📊 Environmental Score Breakdown:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded border">
                      <p className="text-xs font-medium text-gray-600">Sentiment Score</p>
                      <p className="text-lg font-bold text-blue-600">
                        {(analysis.sentiment.environmental.score * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-xs font-medium text-gray-600">Confidence</p>
                      <p className="text-lg font-bold text-green-600">
                        {(analysis.sentiment.environmental.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-xs font-medium text-gray-600">Overall Rating</p>
                      <p className={`text-lg font-bold ${
                        analysis.sentiment.environmental.sentiment === 'positive' ? 'text-green-600' :
                        analysis.sentiment.environmental.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {analysis.sentiment.environmental.sentiment.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Negative Snippets for Environmental */}
                {analysis.negativeSnippets.environmental.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">⚠️ Concerning Environmental Statements:</h4>
                    <ul className="space-y-2">
                      {analysis.negativeSnippets.environmental.map((snippet, index) => (
                        <li key={index} className="text-sm text-red-700 bg-white p-2 rounded border-l-2 border-red-300">
                          &ldquo;{snippet}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

                {/* Negative Snippets for Social */}
                {analysis.negativeSnippets.social.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">⚠️ Concerning Social Statements:</h4>
                    <ul className="space-y-2">
                      {analysis.negativeSnippets.social.map((snippet, index) => (
                        <li key={index} className="text-sm text-red-700 bg-white p-2 rounded border-l-2 border-red-300">
                          &ldquo;{snippet}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

                {/* Negative Snippets for Governance */}
                {analysis.negativeSnippets.governance.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">⚠️ Concerning Governance Statements:</h4>
                    <ul className="space-y-2">
                      {analysis.negativeSnippets.governance.map((snippet, index) => (
                        <li key={index} className="text-sm text-red-700 bg-white p-2 rounded border-l-2 border-red-300">
                          &ldquo;{snippet}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
