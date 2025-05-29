import { NextResponse } from 'next/server';
import { analyze } from '@/lib/analyzer';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
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