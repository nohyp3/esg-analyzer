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
    
    // Handle regular URL analysis
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await analyze(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze the URL' },
      { status: 500 }
    );
  }
} 