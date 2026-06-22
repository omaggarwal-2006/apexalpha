/**
 * GET /api/market/price?symbol=BTC-USD
 * 
 * Next.js Route Handler — Caching proxy for market price data.
 * Sits in front of the Express backend, caching responses for 60 seconds
 * to prevent Yahoo Finance rate-limiting under heavy client polling.
 * 
 * Cache strategy:
 *  - In-memory Map with 60s TTL (per-symbol)
 *  - HTTP Cache-Control headers for CDN/browser caching
 *  - Stale-while-revalidate for seamless background refresh
 */

import { NextResponse } from 'next/server';

// ─── In-Memory Price Cache ────────────────────────────────
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/** @type {Map<string, { data: object, timestamp: number }>} */
const priceCache = new Map();

/**
 * Fetches fresh price data from the Express backend.
 * @param {string} symbol 
 * @returns {Promise<object|null>}
 */
async function fetchFromBackend(symbol) {
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:3001';

  try {
    const response = await fetch(
      `${backendUrl}/api/market/snapshot?symbol=${encodeURIComponent(symbol)}`,
      {
        headers: { 'Accept': 'application/json' },
        // Bypass Next.js fetch cache — we manage our own
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error(`[price-route] Backend returned ${response.status} for ${symbol}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[price-route] Backend fetch failed for ${symbol}:`, error.message);
    return null;
  }
}

// ─── GET Handler ──────────────────────────────────────────

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Missing required parameter: symbol' },
      { status: 400 }
    );
  }

  const cacheKey = symbol.toUpperCase();
  const now = Date.now();

  // ── Check cache ──────────────────────────────────────────
  const cached = priceCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
    const age = Math.floor((now - cached.timestamp) / 1000);
    const maxAge = Math.max(0, 60 - age);

    return NextResponse.json(
      {
        ...cached.data,
        _cache: {
          hit: true,
          cachedAt: new Date(cached.timestamp).toISOString(),
          ttl: 60,
          age,
        },
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=30`,
          'X-Cache': 'HIT',
          'X-Cache-Age': String(age),
        },
      }
    );
  }

  // ── Cache miss: fetch from backend ───────────────────────
  const data = await fetchFromBackend(symbol);

  if (!data) {
    // If we have stale cache, serve it rather than returning an error
    if (cached) {
      return NextResponse.json(
        {
          ...cached.data,
          _cache: { hit: true, stale: true, cachedAt: new Date(cached.timestamp).toISOString(), ttl: 60 },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
            'X-Cache': 'STALE',
          },
        }
      );
    }

    return NextResponse.json(
      { error: `No data available for symbol: ${symbol}` },
      { status: 502 }
    );
  }

  // ── Normalize response structure ─────────────────────────
  const normalized = {
    symbol: data.symbol || symbol,
    name: data.name || symbol,
    price: data.price ?? 0,
    changePercent: data.changePercent ?? 0,
    volume: data.volume ?? 0,
    averageVolume: data.averageVolume ?? 0,
    marketState: data.marketState || 'UNKNOWN',
    quoteType: data.quoteType || null,
    recommendationMean: data.recommendationMean || null,
    sparklineData: data.sparklineData || [],
  };

  // ── Store in cache ───────────────────────────────────────
  priceCache.set(cacheKey, { data: normalized, timestamp: now });

  return NextResponse.json(
    {
      ...normalized,
      _cache: {
        hit: false,
        cachedAt: new Date(now).toISOString(),
        ttl: 60,
        age: 0,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'X-Cache': 'MISS',
      },
    }
  );
}
