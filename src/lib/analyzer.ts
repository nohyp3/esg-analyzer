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
  negativeSnippets: {
    environmental: string[];
    social: string[];
    governance: string[];
  };
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

function getKeywordWeight(keyword: string, category: keyof typeof keywords): number {
  // More important keywords get higher weights
  const weights: { [key: string]: { [key: string]: number } } = {
    environmental: {
      'climate': 1.5,
      'carbon': 1.5,
      'emissions': 1.5,
      'renewable': 1.3,
      'sustainability': 1.2,
      'environmental': 1.0,
      'green': 1.0,
      'pollution': 1.4,
      'conservation': 1.1,
      'biodiversity': 1.2,
      'water': 1.0,
      'footprint': 1.1,
      'waste': 1.0,
      'recycling': 1.0,
      'energy': 1.0
    },
    social: {
      'diversity': 1.4,
      'inclusion': 1.4,
      'employee': 1.2,
      'community': 1.1,
      'health': 1.0,
      'safety': 1.3,
      'human rights': 1.5,
      'labor': 1.2,
      'training': 1.0,
      'development': 1.0,
      'equality': 1.3,
      'workplace': 1.0,
      'social responsibility': 1.4,
      'stakeholder': 1.1,
      'engagement': 1.0
    },
    governance: {
      'board': 1.2,
      'compliance': 1.4,
      'transparency': 1.5,
      'ethics': 1.5,
      'risk': 1.1,
      'management': 1.0,
      'accountability': 1.4,
      'shareholder': 1.2,
      'audit': 1.3,
      'compensation': 1.1,
      'disclosure': 1.3,
      'policy': 1.0,
      'regulation': 1.2,
      'corruption': 1.5,
      'governance': 1.0
    }
  };
  
  return weights[category][keyword] || 1.0;
}

function calculateScore(content: string, category: keyof typeof keywords): number {
  const lowerContent = content.toLowerCase();
  const words = lowerContent.split(/\s+/);
  const totalWords = words.length;
  
  if (totalWords === 0) return 0;
  
  let score = 0;
  let foundKeywords = 0;
  
  keywords[category].forEach(keyword => {
    // Count occurrences of this keyword (case-insensitive)
    const keywordCount = (lowerContent.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    if (keywordCount > 0) {
      foundKeywords++;
      // Calculate term frequency
      const termFrequency = keywordCount / totalWords;
      // Weight by keyword importance
      const keywordWeight = getKeywordWeight(keyword, category);
      score += termFrequency * keywordWeight * 1000; // Scale up for better scoring
    }
  });
  
  // If no keywords found, return 0
  if (foundKeywords === 0) return 0;
  
  // Normalize score based on found keywords vs total keywords
  const keywordCoverage = foundKeywords / keywords[category].length;
  const normalizedScore = (score * keywordCoverage);
  
  // Cap at 100 and ensure minimum meaningful score
  return Math.min(Math.round(normalizedScore), 100);
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

export async function analyze(input: string): Promise<AnalysisResult> {
  try {
    let content: string;
    
    // Check if input is a URL or text content
    if (input.startsWith('http://') || input.startsWith('https://')) {
      // It's a URL, fetch the content
      const response = await axios.get(input);
      const $ = cheerio.load(response.data);
      content = $('body').text();
    } else {
      // It's text content, use it directly
      content = input;
    }
    
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
    
    // Extract negative snippets for each category
    const negativeSnippets = {
      environmental: extractNegativeSnippets(content, 'environmental'),
      social: extractNegativeSnippets(content, 'social'),
      governance: extractNegativeSnippets(content, 'governance')
    };

    return {
      environmental: `Score: ${environmentalScore}/100 - ${generateCategorySummary('environmental', environmentalScore)}`,
      social: `Score: ${socialScore}/100 - ${generateCategorySummary('social', socialScore)}`,
      governance: `Score: ${governanceScore}/100 - ${generateCategorySummary('governance', governanceScore)}`,
      score: overallScore,
      summary: generateSummary(scores),
      negativeSnippets,
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

function extractNegativeSnippets(content: string, category: keyof typeof keywords): string[] {
  const categoryKeywords = keywords[category];
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  // Negative words/phrases to look for
  const negativeWords = [
    'failure', 'decline', 'decrease', 'violation', 'penalty', 'fine',
    'corruption', 'fraud', 'misconduct', 'non-compliance', 'breach',
    'negligence', 'irresponsibility', 'unethical', 'unlawful', 'illegal',
    'harmful', 'damaging', 'destructive', 'polluting', 'contaminating',
    'wasting', 'inefficient', 'ineffective', 'inadequate', 'insufficient',
    'deficient', 'weak', 'poor', 'bad', 'negative', 'problematic',
    'concerning', 'worrisome', 'troubling', 'alarming', 'disturbing',
    'disappointing', 'unsatisfactory', 'substandard', 'below', 'under',
    'lack', 'absence', 'missing', 'omitted', 'ignored', 'overlooked',
    'neglected', 'abandoned', 'discarded', 'rejected', 'denied',
    'refused', 'blocked', 'prevented', 'hindered', 'obstructed',
    'impeded', 'delayed', 'postponed', 'cancelled', 'terminated',
    'discontinued', 'suspended', 'banned', 'prohibited', 'restricted',
    'limited', 'constrained', 'reduced', 'cut', 'slashed', 'eliminated',
    'removed', 'withdrawn', 'retracted', 'recalled', 'recanted'
  ];
  const negativeSnippets: string[] = [];

  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    
    // Check if sentence contains both category keywords and negative words
    const hasCategoryKeyword = categoryKeywords.some(keyword => 
      lowerSentence.includes(keyword.toLowerCase())
    );
    
    const hasNegativeWord = negativeWords.some(negativeWord => 
      lowerSentence.includes(negativeWord.toLowerCase())
    );
    
    if (hasCategoryKeyword && hasNegativeWord) {
      // Clean up the sentence and limit length
      const cleanSentence = sentence.trim().substring(0, 200);
      if (cleanSentence.length > 20) { // Only include substantial sentences
        negativeSnippets.push(cleanSentence);
      }
    }
  });
  return negativeSnippets.slice(0, 5); // Return only 5 negative snippets
}