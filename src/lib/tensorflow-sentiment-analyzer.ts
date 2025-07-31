import * as tf from '@tensorflow/tfjs';

export class TensorFlowSentimentAnalyzer {
  private static instance: TensorFlowSentimentAnalyzer | null = null;
  private model: tf.LayersModel | null = null;
  private tokenizer: Map<string, number> = new Map();
  private maxLength: number = 100;
  private vocabularySize: number = 10000;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): TensorFlowSentimentAnalyzer {
    if (!TensorFlowSentimentAnalyzer.instance) {
      TensorFlowSentimentAnalyzer.instance = new TensorFlowSentimentAnalyzer();
    }
    return TensorFlowSentimentAnalyzer.instance;
  }

  private async initializeModel(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initializeModel();
    return this.initializationPromise;
  }

  private async _initializeModel(): Promise<void> {
    try {
      console.log('Initializing TensorFlow sentiment model...');
      
      // Create a simple LSTM-based model for sentiment analysis
      this.model = tf.sequential({
        layers: [
          tf.layers.embedding({
            inputDim: this.vocabularySize,
            outputDim: 128,
            inputLength: this.maxLength
          }),
          tf.layers.lstm({
            units: 64,
            returnSequences: false,
            dropout: 0.2,
            recurrentDropout: 0.2
          }),
          tf.layers.dropout({
            rate: 0.2
          }),
          tf.layers.dense({
            units: 32,
            activation: 'relu'
          }),
          tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
          })
        ]
      });

      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Initialize vocabulary with common words
      this.initializeVocabulary();
      
      this.isInitialized = true;
      console.log('TensorFlow sentiment model initialized successfully');
    } catch (error) {
      console.error('Error initializing TensorFlow model:', error);
      throw error;
    }
  }

  private initializeVocabulary() {
    // Common English words for sentiment analysis
    const commonWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'outstanding',
      'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'disappointing',
      'love', 'like', 'enjoy', 'hate', 'dislike', 'detest',
      'happy', 'sad', 'angry', 'excited', 'bored', 'interested',
      'success', 'failure', 'win', 'lose', 'achieve', 'fail',
      'improve', 'decline', 'increase', 'decrease', 'better', 'worse',
      'positive', 'negative', 'neutral', 'satisfied', 'unsatisfied',
      'recommend', 'avoid', 'buy', 'sell', 'invest', 'divest',
      'quality', 'poor', 'excellent', 'average', 'above', 'below',
      'environmental', 'social', 'governance', 'sustainability', 'responsibility',
      'innovation', 'tradition', 'modern', 'outdated', 'efficient', 'inefficient',
      'transparent', 'opaque', 'accountable', 'irresponsible', 'ethical', 'unethical'
    ];

    // Add words to vocabulary with indices
    commonWords.forEach((word, index) => {
      this.tokenizer.set(word.toLowerCase(), index + 1); // Start from 1, 0 is reserved for padding
    });
  }

  private preprocessText(text: string): number[] {
    // Convert text to lowercase and split into words
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    // Convert words to indices
    const indices = words.map(word => this.tokenizer.get(word) || 0);

    // Pad or truncate to maxLength
    if (indices.length > this.maxLength) {
      return indices.slice(0, this.maxLength);
    } else {
      return indices.concat(new Array(this.maxLength - indices.length).fill(0));
    }
  }

  private async trainModel(trainingData: Array<{ text: string; label: number }>) {
    if (!this.model) {
      console.error('Model not initialized');
      return;
    }

    try {
      // Prepare training data
      const texts = trainingData.map(item => this.preprocessText(item.text));
      const labels = trainingData.map(item => item.label);

      // Convert to tensors
      const xs = tf.tensor2d(texts);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      // Train the model
      await this.model.fit(xs, ys, {
        epochs: 3, // Reduced from 10 to 3 for faster training
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.acc?.toFixed(4)}`);
          }
        }
      });

      // Clean up tensors
      xs.dispose();
      ys.dispose();

      console.log('Model training completed');
    } catch (error) {
      console.error('Error training model:', error);
    }
  }

  public async loadPretrainedModel(modelUrl?: string) {
    try {
      // Initialize the model first
      await this.initializeModel();
      
      if (modelUrl) {
        // Load a pre-trained model from URL
        this.model = await tf.loadLayersModel(modelUrl);
      } else if (!this.model) {
        // Train with some sample data if no pre-trained model is available
        console.log('Training model with sample data...');
        const sampleData = [
          { text: "This is excellent and amazing", label: 1 },
          { text: "Great performance and outstanding results", label: 1 },
          { text: "Wonderful experience and highly recommended", label: 1 },
          { text: "Terrible service and awful experience", label: 0 },
          { text: "Disappointing results and poor quality", label: 0 },
          { text: "Bad performance and negative impact", label: 0 },
          { text: "The company shows strong commitment to sustainability", label: 1 },
          { text: "Environmental initiatives are making positive impact", label: 1 },
          { text: "Social responsibility programs are effective", label: 1 },
          { text: "Governance failures led to compliance issues", label: 0 },
          { text: "Environmental violations caused significant damage", label: 0 },
          { text: "Social programs are inadequate and poorly managed", label: 0 },
          { text: "The company is neutral in its approach", label: 0.5 },
          { text: "Standard performance with mixed results", label: 0.5 },
          { text: "Average quality with room for improvement", label: 0.5 }
        ];

        await this.trainModel(sampleData);
        console.log('Model training completed successfully');
      }
    } catch (error) {
      console.error('Error loading pre-trained model:', error);
      throw error;
    }
  }

  public async analyzeSentiment(text: string): Promise<{
    score: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }> {
    if (!this.model) {
      throw new Error('Model not initialized. Please call loadPretrainedModel() first.');
    }

    try {
      // Preprocess the text
      const processedText = this.preprocessText(text);
      
      // Convert to tensor
      const inputTensor = tf.tensor2d([processedText]);
      
      // Make prediction
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const score = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      const sentimentScore = score[0];
      
      // Determine sentiment and confidence
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
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
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

  public async saveModel(path: string) {
    if (this.model) {
      await this.model.save(`file://${path}`);
    }
  }

  public async loadModel(path: string) {
    this.model = await tf.loadLayersModel(`file://${path}`);
  }
} 