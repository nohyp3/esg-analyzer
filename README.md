# ESG Content Analyzer

A comprehensive ESG (Environmental, Social, and Governance) content analyzer that uses advanced text analysis and **TensorFlow.js-based sentiment analysis** to evaluate ESG content from web pages.

## Features

### 🔍 ESG Content Analysis
- **Environmental Factors**: Analyzes climate, carbon emissions, renewable energy, waste management, sustainability initiatives
- **Social Factors**: Evaluates diversity, inclusion, employee welfare, community engagement, human rights
- **Governance Factors**: Assesses board structure, compliance, transparency, ethics, risk management

### 🤖 TensorFlow.js Sentiment Analysis
- **Deep Learning Model**: Uses LSTM (Long Short-Term Memory) neural network for sentiment classification
- **Real-time Analysis**: Classifies text as positive, negative, or neutral with confidence scores
- **Interactive Testing**: Test the sentiment analysis with your own text input
- **ESG-Specific Training**: Model trained on ESG-related content for better accuracy

### 📊 Comprehensive Scoring
- TF-IDF based content scoring for each ESG category
- Overall ESG score calculation
- Detailed sentiment analysis for each category
- Confidence metrics for all analyses

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/ML**: TensorFlow.js, Natural.js
- **Web Scraping**: Cheerio, Axios

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd esg-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### ESG Content Analysis
1. Enter a URL to an ESG page (e.g., company sustainability report)
2. Click "Analyze ESG Content"
3. View comprehensive analysis including:
   - Environmental, Social, and Governance scores
   - TensorFlow-based sentiment analysis for each category
   - Overall ESG score and summary

### TensorFlow Sentiment Analysis Test
1. Scroll to the "TensorFlow Sentiment Analysis Test" section
2. Enter any text you want to analyze
3. Click "Analyze Sentiment with TensorFlow"
4. View the sentiment classification (positive/negative/neutral) with confidence scores

## How the TensorFlow Model Works

### Model Architecture
- **Embedding Layer**: Converts words to dense vectors (128 dimensions)
- **LSTM Layer**: Processes sequential text data (64 units)
- **Dense Layers**: Final classification layers with dropout for regularization
- **Output**: Sigmoid activation for binary sentiment classification

### Training Data
The model is trained on ESG-specific content including:
- Positive examples: "excellent commitment to sustainability", "strong environmental initiatives"
- Negative examples: "environmental violations", "governance failures"
- Neutral examples: "standard performance", "mixed results"

### Text Preprocessing
1. **Tokenization**: Converts text to word indices
2. **Vocabulary**: Built from common English and ESG-specific words
3. **Padding**: Ensures consistent input length (100 words max)
4. **Normalization**: Converts to lowercase and removes special characters

## API Endpoints

### POST /api/analyze
Analyzes ESG content from a URL or performs sentiment analysis on text.

**For URL Analysis:**
```json
{
  "url": "https://example.com/esg-page"
}
```

**For Sentiment Analysis:**
```json
{
  "testSentiment": true,
  "text": "This company shows excellent commitment to sustainability"
}
```

## Model Performance

The TensorFlow model provides:
- **Binary Classification**: Positive vs Negative sentiment
- **Confidence Scores**: Probability-based confidence metrics
- **Real-time Processing**: Fast inference for web applications
- **ESG Domain Specialization**: Optimized for environmental, social, and governance content

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Pre-trained model loading from cloud storage
- [ ] Model fine-tuning with user feedback
- [ ] Multi-language support
- [ ] Advanced ESG metrics calculation
- [ ] Historical analysis and trend detection
