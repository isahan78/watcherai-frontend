import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  || 'https://watcherai-backend.onrender.com';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}
