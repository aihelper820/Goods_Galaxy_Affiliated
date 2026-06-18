import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Goods Galaxy Affiliated API is healthy',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
