"use client";
import { useState, useEffect, useRef } from "react";
import { useLiveTrades } from "@/hooks/useLiveTrades";
import { usePortfolio } from "@/hooks/useFirestore";
import { useLivePnL } from "@/hooks/useLivePnL";
import { useAuth } from "@/contexts/AuthContext";

/**
 * useSovereignCore
 * The brain of the Apex Alpha synchronization engine.
 * Unifies user trades, portfolio data, and real-time P&L into a single state stream.
 */
export function useSovereignCore() {
  const { user } = useAuth();
  
  // 1. Subscribe to Live Trades
  const { trades: openTrades, loading: tradesLoading } = useLiveTrades(user?.uid, "open");
  const { trades: closedTrades } = useLiveTrades(user?.uid, "closed");
  
  // 2. Subscribe to Portfolio
  const { data: portfolio, loading: portfolioLoading } = usePortfolio();
  const balance = portfolio?.accountBalance || 0;
  
  // 3. Connect to Real-time P&L Engine (Binance WebSockets)
  const { unrealizedPnL, marginUsed, livePrices } = useLivePnL(openTrades);
  
  // 4. Calculate Instant Equity
  const equity = balance + unrealizedPnL;
  
  // 5. High-Water Mark Tracking
  const peakRef = useRef(0);
  const [peakEquity, setPeakEquity] = useState(0);
  
  useEffect(() => {
    if (equity > peakRef.current) {
      peakRef.current = equity;
      setPeakEquity(equity);
    }
  }, [equity]);

  const drawdown = peakEquity > 0 ? ((peakEquity - equity) / peakEquity) * 100 : 0;
  const marginPct = equity > 0 ? Math.min((marginUsed / equity) * 100, 100) : 0;

  return {
    user,
    openTrades,
    closedTrades,
    balance,
    equity,
    unrealizedPnL,
    marginUsed,
    marginPct,
    peakEquity,
    drawdown,
    livePrices,
    loading: tradesLoading || portfolioLoading
  };
}
