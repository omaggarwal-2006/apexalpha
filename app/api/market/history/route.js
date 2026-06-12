import { NextResponse } from 'next/server';
import axios from 'axios';

export const revalidate = 3600; // ISR cache for 1 hour

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const res = await axios.get(`http://localhost:3001/api/market/snapshot?symbol=${encodeURIComponent(symbol)}`);
    // Extract only the sparkline data for the chart to keep the payload small
    return NextResponse.json({ sparklineData: res.data.sparklineData });
  } catch (error) {
    console.error("ISR fetch failed:", error);
    return NextResponse.json({ sparklineData: [] });
  }
}
