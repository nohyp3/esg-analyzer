import axios from 'axios';
import * as cheerio from 'cheerio';
import natural from 'natural';

const TfIdf = natural.TfIdf;

// Keywords for each ESG category
const keywords = {
  environmental: [
    'climate', 'carbon', 'emissions', 'renewable', 'energy', 'waste', 'recycling',
    'sustainability', 'environmental', 'green', 'pollution', 'conservation',
    'biodiversity', 'water', 'footprint'
  ],
  social: [
    'diversity', 'inclusion', 'employee', 'community', 'health', 'safety',
    'human rights', 'labor', 'training', 'development', 'equality', 'workplace',
    'social responsibility', 'stakeholder', 'engagement'
  ],
  governance: [
    'board', 'compliance', 'transparency', 'ethics', 'risk', 'management',
    'accountability', 'shareholder', 'audit', 'compensation', 'disclosure',
    'policy', 'regulation', 'corruption', 'governance'
  ]
};

interface AnalysisResult {
  environmental: string;
  social: string;
  governance: string;
  score: number;
  summary: string;
}

function calculateScore(content: string, category: keyof typeof keywords): number {
  const tfidf = new TfIdf();
  tfidf.addDocument(content.toLowerCase());
  
  let score = 0;
  keywords[category].forEach(keyword => {
    const keywordScore = tfidf.tfidf(keyword, 0);
    score += keywordScore;
  });
  
  return Math.min(Math.round((score / keywords[category].length) * 100), 100);
}

function generateSummary(scores: { [key: string]: number }): string {
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 3;
  
  if (avgScore >= 80) {
    return "Excellent ESG practices with comprehensive coverage across all areas.";
  } else if (avgScore >= 60) {
    return "Good ESG implementation with room for improvement in some areas.";
  } else if (avgScore >= 40) {
    return "Moderate ESG practices. Significant improvement needed.";
  } else {
    return "Limited ESG disclosure. Major improvements required across all areas.";
  }
}

export async function analyze(url: string): Promise<AnalysisResult> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract text content from the page
    const content = $('body').text();
    
    // Calculate scores for each category
    const environmentalScore = calculateScore(content, 'environmental');
    const socialScore = calculateScore(content, 'social');
    const governanceScore = calculateScore(content, 'governance');
    
    // Generate category summaries
    const scores = {
      environmental: environmentalScore,
      social: socialScore,
      governance: governanceScore
    };
    
    const overallScore = Math.round(
      (environmentalScore + socialScore + governanceScore) / 3
    );
    
    return {
      environmental: `Score: ${environmentalScore}/100 - ${generateCategorySummary('environmental', environmentalScore)}`,
      social: `Score: ${socialScore}/100 - ${generateCategorySummary('social', socialScore)}`,
      governance: `Score: ${governanceScore}/100 - ${generateCategorySummary('governance', governanceScore)}`,
      score: overallScore,
      summary: generateSummary(scores)
    };
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw new Error('Failed to analyze the URL');
  }
}

function generateCategorySummary(category: string, score: number): string {
  if (score >= 80) {
    return `Strong ${category} practices and comprehensive disclosure.`;
  } else if (score >= 60) {
    return `Good ${category} initiatives with some areas for improvement.`;
  } else if (score >= 40) {
    return `Basic ${category} considerations present but needs enhancement.`;
  } else {
    return `Limited ${category} disclosure and practices identified.`;
  }
} 