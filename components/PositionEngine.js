"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, X, RefreshCw, Activity } from "lucide-react";
import axios from "axios";
import { auth } from "@/lib/firebase";
import { TradeService } from "@/services/TradeService";
import toast from "react-hot-toast";
import { useLivePnL } from "@/hooks/useLivePnL";

function toBinanceSym(raw = "") {
  const s = raw.toUpperCase().trim();
  const map = {
    "BTC-USD": "BTCUSDT", "BITCOIN": "BTCUSDT", "BTC": "BTCUSDT",
    "ETH-USD": "ETHUSDT", "ETHEREUM": "ETHUSDT", "ETH": "ETHUSDT",
    "SOL-USD": "SOLUSDT", "SOLANA": "SOLUSDT", "SOL": "SOLUSDT",
  };
  if (map[s]) return map[s].toLowerCase();
  if (s.endsWith("USDT")) return s.toLowerCase();
  const replaced = s.replace(/[-_\/]USD$/, "USDT");
  if (replaced.endsWith("USDT")) return replaced.toLowerCase();
  return null;
}

import { useAuth } from "@/contexts/AuthContext";

export default function PositionEngine({ trades = [], currentPrice = 0 }) {
  const { user } = useAuth();
  const [closing, setClosing] = useState(null);
  const { livePrices } = useLivePnL(trades);

  const openTrades = trades.filter(t => {
    const s = t.status?.toUpperCase();
    return s === "OPEN" || s === "ACTIVE";
  });

  const getLivePrice = (trade) => {
    const sym = toBinanceSym(trade.asset || trade.symbol || "BTC-USD");
    return (sym && livePrices[sym]) || trade.entryPrice || 0;
  };

  const calcPnL = useCallback((trade) => {
    const currentPrice = getLivePrice(trade);
    const lots = trade.lot || trade.lots || 1;
    const contractSize = trade.contractSize || 1;
    const isShort = trade.type === "SELL" || trade.type === "SHORT";
    const spread = isShort
      ? (trade.entryPrice || 0) - currentPrice
      : currentPrice - (trade.entryPrice || 0);
    return spread * lots * contractSize;
  }, [livePrices]); // eslint-disable-line

  const handleClose = useCallback(async (trade) => {
    setClosing(trade.id);
    const currentPrice = getLivePrice(trade);
    const lots = trade.lot || trade.lots || 1;
    const pnl = calcPnL(trade);

    toast.success(`Position closed — PnL: ${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`);

    const isLocal = !user || trade.id.startsWith("trade-") || trade.id.startsWith("local-");

    if (isLocal) {
      // Local close updating local ledger and balance
      await TradeService.closeTrade(user?.uid || "mock-sovereign-user-id", trade.id, {
        exitPrice: currentPrice,
        pnl
      });
    } else {
      // Backend + Firestore sync
      try {
        const token = await user.getIdToken();
        await Promise.all([
          axios.post(`/api/trade/close/${trade.id}`, {}, { headers: { Authorization: `Bearer ${token}` } }),
          TradeService.closeTrade(user.uid, trade.id, { 
            exitPrice: currentPrice, 
            pnl
          })
        ]);
      } catch (err) {
        console.warn("[PositionEngine] Close sync failed:", err.message);
      }
    }
    setClosing(null);
  }, [livePrices, user, calcPnL]); // eslint-disable-line

  if (openTrades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
        <Activity size={28} className="text-gray-800" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No Open Positions</p>
        <p className="text-[9px] text-gray-800 font-mono">Execute a BUY or SELL to open a position</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left font-mono text-[10px]">
        <thead>
          <tr className="border-b border-white/5 text-gray-600 uppercase tracking-widest text-[8px]">
            <th className="pb-3 pr-4 font-black">Asset</th>
            <th className="pb-3 pr-4 font-black">Type</th>
            <th className="pb-3 pr-4 font-black">Lots</th>
            <th className="pb-3 pr-4 font-black">Lev</th>
            <th className="pb-3 pr-4 font-black">Entry</th>
            <th className="pb-3 pr-4 font-black">Mark</th>
            <th className="pb-3 pr-4 font-black">Live P&L</th>
            <th className="pb-3 font-black">Close</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {openTrades.map((trade) => {
              const pnl = calcPnL(trade);
              const mark = getLivePrice(trade);
              const isPos = pnl >= 0;
              const sym = toBinanceSym(trade.asset || trade.symbol || "");
              const hasLive = sym && livePrices[sym];
              return (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-4 font-black text-white text-[11px]">
                    {trade.asset || trade.symbol}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`flex items-center gap-1 font-black text-[9px] px-2 py-0.5 ${
                      trade.type === "BUY" ? "bg-[#00FF41]/10 text-[#00FF41]" : "bg-[#FF3131]/10 text-[#FF3131]"
                    }`}>
                      {trade.type === "BUY" ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{trade.lot || trade.lots}</td>
                  <td className="py-3 pr-4 text-gray-400">{trade.leverage ?? 1}x</td>
                  <td className="py-3 pr-4 text-gray-400">
                    ${(trade.entryPrice ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 pr-4">
                    <span suppressHydrationWarning={true} className={`font-mono text-[11px] ${hasLive ? "text-white" : "text-gray-600"}`}>
                      ${mark.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {hasLive && <span className="w-1 h-1 bg-[#00FF41] rounded-full inline-block ml-1 animate-pulse" />}
                    </span>
                  </td>
                  <td suppressHydrationWarning={true} className={`py-3 pr-4 font-black text-[12px] ${isPos ? "text-[#00FF41]" : "text-[#FF3131]"}`}>
                    {isPos ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleClose(trade)}
                      disabled={closing === trade.id}
                      className="flex items-center gap-1 px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-white/10 text-gray-500 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-30"
                    >
                      {closing === trade.id ? <RefreshCw size={8} className="animate-spin" /> : <X size={8} />}
                      Close
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
