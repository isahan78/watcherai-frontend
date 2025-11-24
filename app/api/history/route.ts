import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  || 'https://watcherai-backend.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';

    const response = await fetch(
      `${BACKEND_URL}/history?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}
