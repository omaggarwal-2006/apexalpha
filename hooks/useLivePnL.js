"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// Resolve any asset symbol to a Binance USDT pair key (lowercase, e.g. "btcusdt")
function toBinanceSym(raw = "") {
  const s = raw.toUpperCase().trim();
  const map = {
    "BTC-USD": "BTCUSDT", "BITCOIN": "BTCUSDT", "BITCOIN USD": "BTCUSDT", "BTC": "BTCUSDT",
    "ETH-USD": "ETHUSDT", "ETHEREUM": "ETHUSDT", "ETHEREUM USD": "ETHUSDT", "ETH": "ETHUSDT",
    "SOL-USD": "SOLUSDT", "SOLANA": "SOLUSDT", "SOLANA USD": "SOLUSDT", "SOL": "SOLUSDT",
    "BNB-USD": "BNBUSDT", "DOGE-USD": "DOGEUSDT", "ADA-USD": "ADAUSDT",
    "XRP-USD": "XRPUSDT", "AVAX-USD": "AVAXUSDT",
  };
  if (map[s]) return map[s].toLowerCase();
  // Already ends with USDT
  if (s.endsWith("USDT")) return s.toLowerCase();
  // e.g. BTC → BTCUSDT
  if (!s.includes("-") && !s.includes("/") && s.length <= 6) return (s + "USDT").toLowerCase();
  // Replace -USD suffix
  const replaced = s.replace(/[-_\/]USD$/, "USDT");
  if (replaced.endsWith("USDT")) return replaced.toLowerCase();
  // Non-crypto (stocks, indices) — can't stream via Binance
  return null;
}

/**
 * useLivePnL
 * Opens a Binance WebSocket stream for all unique symbols from open trades.
 * Falls back to entryPrice when symbol is non-crypto.
 * Returns { livePrices, unrealizedPnL, marginUsed }
 */
export function useLivePnL(trades = []) {
  const [livePrices, setLivePrices] = useState({});
  const [unrealizedPnL, setUnrealizedPnL] = useState(0);
  const [marginUsed, setMarginUsed] = useState(0);
  const wsRef = useRef(null);
  const prevStreamRef = useRef("");

  // Derive the stream key from open trade symbols
  const openTrades = trades.filter(t => t.status === "OPEN" || t.status === "open");

  const binanceSyms = [...new Set(
    openTrades
      .map(t => toBinanceSym(t.asset || t.symbol || "BTC-USD"))
      .filter(Boolean)
  )];

  const streamKey = binanceSyms.sort().join(",");

  // (Re)open WebSocket when the set of symbols changes
  useEffect(() => {
    if (streamKey === prevStreamRef.current) return;
    prevStreamRef.current = streamKey;

    // Close old connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (binanceSyms.length === 0) return;

    const path = binanceSyms.map(s => `${s}@ticker`).join("/");
    const url = `wss://stream.binance.com:9443/ws/${path}`;
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.s && data.c) {
          setLivePrices(prev => ({ ...prev, [data.s.toLowerCase()]: parseFloat(data.c) }));
        }
        // Combined stream wraps events in { stream, data }
        if (data.data?.s && data.data?.c) {
          setLivePrices(prev => ({
            ...prev,
            [data.data.s.toLowerCase()]: parseFloat(data.data.c)
          }));
        }
      } catch {}
    };

    ws.onerror = () => console.warn("[useLivePnL] WebSocket error — using entry prices as fallback");

    wsRef.current = ws;
    return () => { ws.close(); wsRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamKey]);

  // Recalculate PnL + margin whenever prices or trades change
  useEffect(() => {
    let pnl = 0;
    let margin = 0;

    openTrades.forEach(trade => {
      const binSym = toBinanceSym(trade.asset || trade.symbol || "BTC-USD");
      const currentPrice =
        (binSym && livePrices[binSym]) ||
        (binSym && livePrices[binSym?.toUpperCase()]) ||
        trade.currentPrice ||
        trade.entryPrice ||
        0;

      const lots = trade.lot || trade.lots || 1;
      const contractSize = trade.contractSize || 1;
      const leverage = trade.leverage || 1;
      const entryPrice = trade.entryPrice || 0;

      // PnL
      const isShort = trade.type === "SELL" || trade.type === "SHORT";
      const spread = isShort
        ? entryPrice - currentPrice
        : currentPrice - entryPrice;
      pnl += spread * lots * contractSize;

      // Margin used = (entryPrice × lots × contractSize) / leverage
      margin += (entryPrice * lots * contractSize) / leverage;
    });

    setUnrealizedPnL(pnl);
    setMarginUsed(margin);
  }, [openTrades.length, livePrices]); // eslint-disable-line react-hooks/exhaustive-deps

  return { livePrices, unrealizedPnL, marginUsed };
}
