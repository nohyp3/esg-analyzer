// Simple rule-based sentiment analysis for ESG content
export class SentimentAnalyzer {
  private positiveWords: Set<string> = new Set();
  private negativeWords: Set<string> = new Set();
  private intensifiers: Set<string> = new Set();

  constructor() {
    this.initializeDictionaries();
  }

  private initializeDictionaries() {
    // Positive ESG-related words
    this.positiveWords = new Set([
      'commitment', 'excellence', 'strong', 'improve', 'increase', 'achieve',
      'innovation', 'transparency', 'accountability', 'sustainability',
      'renewable', 'diversity', 'inclusion', 'engagement', 'development',
      'training', 'safety', 'rights', 'equality', 'fairness', 'justice',
      'award', 'recognition', 'certification', 'standard', 'benchmark',
      'goal', 'objective', 'strategy', 'initiative', 'program', 'project',
      'investment', 'funding', 'saving', 'efficiency', 'performance',
      'metric', 'kpi', 'indicator', 'measure', 'assessment', 'audit',
      'review', 'evaluation', 'analysis', 'report', 'disclosure',
      'communication', 'stakeholder', 'shareholder', 'investor', 'customer',
      'employee', 'supplier', 'partner', 'community', 'society',
      'leadership', 'team', 'organization', 'company', 'corporation',
      'enterprise', 'business', 'industry', 'sector', 'market', 'economy',
      'global', 'local', 'regional', 'national', 'international',
      'worldwide', 'world', 'planet', 'earth', 'future', 'present',
      'legacy', 'heritage', 'tradition', 'culture', 'value', 'principle',
      'belief', 'mission', 'vision', 'purpose', 'success', 'growth',
      'progress', 'advancement', 'enhancement', 'optimization', 'maximization',
      'minimization', 'reduction', 'elimination', 'prevention', 'protection',
      'conservation', 'preservation', 'restoration', 'rehabilitation',
      'empowerment', 'enablement', 'facilitation', 'support', 'assistance',
      'collaboration', 'cooperation', 'partnership', 'alliance', 'network',
      'integration', 'coordination', 'alignment', 'harmonization', 'unification'
    ]);

    // Negative ESG-related words
    this.negativeWords = new Set([
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
    ]);

    // Intensifiers that modify sentiment strength
    this.intensifiers = new Set([
      'very', 'extremely', 'highly', 'significantly', 'substantially',
      'considerably', 'greatly', 'massively', 'enormously', 'tremendously',
      'exceptionally', 'outstandingly', 'remarkably', 'notably', 'particularly',
      'especially', 'specifically', 'exclusively', 'completely', 'totally',
      'absolutely', 'entirely', 'thoroughly', 'comprehensively', 'extensively',
      'intensively', 'aggressively', 'proactively', 'actively', 'dynamically',
      'vigorously', 'energetically', 'enthusiastically', 'passionately',
      'dedicatedly', 'committedly', 'devotedly', 'loyally', 'faithfully',
      'reliably', 'consistently', 'steadily', 'continuously', 'persistently',
      'determinedly', 'resolutely', 'firmly', 'strongly', 'robustly',
      'solidly', 'securely', 'safely', 'confidently', 'assuredly'
    ]);
  }

  private preprocessText(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  private calculateSentimentScore(words: string[]): number {
    let positiveScore = 0;
    let negativeScore = 0;
    let intensifierCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const nextWord = words[i + 1];

      if (this.positiveWords.has(word)) {
        positiveScore += 1;
        // Check if next word is an intensifier
        if (nextWord && this.intensifiers.has(nextWord)) {
          positiveScore += 0.5;
          intensifierCount++;
        }
      } else if (this.negativeWords.has(word)) {
        negativeScore += 1;
        // Check if next word is an intensifier
        if (nextWord && this.intensifiers.has(nextWord)) {
          negativeScore += 0.5;
          intensifierCount++;
        }
      } else if (this.intensifiers.has(word)) {
        intensifierCount++;
      }
    }

    // Calculate normalized score between 0 and 1
    const totalScore = positiveScore + negativeScore;
    
    if (totalScore === 0) {
      return 0.5; // Neutral if no sentiment words found
    }

    const sentimentRatio = positiveScore / totalScore;
    const intensityMultiplier = Math.min(1 + (intensifierCount * 0.1), 1.5);
    
    return Math.min(Math.max(sentimentRatio * intensityMultiplier, 0), 1);
  }

  public async analyzeSentiment(text: string): Promise<{
    score: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }> {
    const words = this.preprocessText(text);
    const sentimentScore = this.calculateSentimentScore(words);
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;
    
    if (sentimentScore > 0.6) {
      sentiment = 'positive';
      confidence = sentimentScore;
    } else if (sentimentScore < 0.4) {
      sentiment = 'negative';
      confidence = 1 - sentimentScore;
    } else {
      sentiment = 'neutral';
      confidence = 0.5;
    }
    
    return {
      score: sentimentScore,
      sentiment,
      confidence
    };
  }

  public async analyzeESGSentiment(environmentalText: string, socialText: string, governanceText: string) {
    const [envSentiment, socialSentiment, govSentiment] = await Promise.all([
      this.analyzeSentiment(environmentalText),
      this.analyzeSentiment(socialText),
      this.analyzeSentiment(governanceText)
    ]);

    return {
      environmental: envSentiment,
      social: socialSentiment,
      governance: govSentiment,
      overall: {
        score: (envSentiment.score + socialSentiment.score + govSentiment.score) / 3,
        sentiment: this.getOverallSentiment([envSentiment, socialSentiment, govSentiment]),
        confidence: (envSentiment.confidence + socialSentiment.confidence + govSentiment.confidence) / 3
      }
    };
  }

  private getOverallSentiment(sentiments: Array<{ sentiment: string; score: number }>): 'positive' | 'negative' | 'neutral' {
    const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
    
    if (avgScore > 0.6) return 'positive';
    if (avgScore < 0.4) return 'negative';
    return 'neutral';
  }
} 