import { NextResponse } from 'next/server';
import { analyze } from '@/lib/analyzer';
import { TensorFlowSentimentAnalyzer } from '@/lib/tensorflow-sentiment-analyzer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle sentiment test requests
    if (body.testSentiment && body.text) {
      const sentimentAnalyzer = TensorFlowSentimentAnalyzer.getInstance();
      await sentimentAnalyzer.loadPretrainedModel();
      
      const result = await sentimentAnalyzer.analyzeSentiment(body.text);
      return NextResponse.json(result);
    }

    // Handle regular ESG analysis requests
    if (body.content) {
      const result = await analyze(body.content);
      return NextResponse.json(result);
    }

    // If no valid request body is provided
    return NextResponse.json(
      { error: 'Invalid request. Please provide either testSentiment with text or content for ESG analysis.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze the URL' },
      { status: 500 }
    );
  }
} 