import axios from 'axios';
import * as cheerio from 'cheerio';
import natural from 'natural';
import { TensorFlowSentimentAnalyzer } from './tensorflow-sentiment-analyzer';

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

    // Initialize TensorFlow sentiment analyzer
    const sentimentAnalyzer = TensorFlowSentimentAnalyzer.getInstance();
    
    // Load pre-trained model (this will train with sample data if no pre-trained model is available)
    await sentimentAnalyzer.loadPretrainedModel();
    
    // Extract ESG-specific content for sentiment analysis
    const environmentalContent = extractESGContent(content, 'environmental');
    const socialContent = extractESGContent(content, 'social');
    const governanceContent = extractESGContent(content, 'governance');
    
    // Perform sentiment analysis
    const sentimentResults = await sentimentAnalyzer.analyzeESGSentiment(
      environmentalContent,
      socialContent,
      governanceContent
    );
    
    return {
      environmental: `Score: ${environmentalScore}/100 - ${generateCategorySummary('environmental', environmentalScore)}`,
      social: `Score: ${socialScore}/100 - ${generateCategorySummary('social', socialScore)}`,
      governance: `Score: ${governanceScore}/100 - ${generateCategorySummary('governance', governanceScore)}`,
      score: overallScore,
      summary: generateSummary(scores),
      sentiment: sentimentResults
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

function extractESGContent(content: string, category: keyof typeof keywords): string {
  const categoryKeywords = keywords[category];
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return categoryKeywords.some(keyword => lowerSentence.includes(keyword.toLowerCase()));
  });
  
  return relevantSentences.join('. ').substring(0, 1000); // Limit to 1000 characters
} 