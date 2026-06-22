"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, X, RefreshCw, Activity } from "lucide-react";
import axios from "axios";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ActivePositions({ trades = [], currentPrice, balance, setBalance, setTrades }) {
  const [closing, setClosing] = useState(null);

  const openTrades = trades.filter(t => t.status === "OPEN" || t.status === "open");

  const calcPnL = (trade) => {
    const lp = currentPrice || trade.entryPrice || 0;
    const spread = trade.type === "BUY"
      ? lp - trade.entryPrice
      : trade.entryPrice - lp;
    return spread * (trade.lot ?? 1);
  };

  const handleClose = useCallback(async (trade) => {
    setClosing(trade.id);
    const lp = currentPrice || trade.entryPrice || 100;
    const pnl = calcPnL(trade);
    const marginRequired = (trade.entryPrice * (trade.lot ?? 1)) / (trade.leverage ?? 1);
    const returned = marginRequired + pnl;

    // Optimistic local update
    setTrades(prev => prev.map(t =>
      t.id === trade.id ? { ...t, status: "CLOSED", exitPrice: lp, pnl } : t
    ));
    setBalance(b => {
      const nb = b + returned;
      localStorage.setItem("apex_local_balance", nb.toString());
      return nb;
    });

    toast.success(`Position closed — PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`);

    // Backend sync
    if (auth.currentUser && !trade.id.startsWith("trade-") && !trade.id.startsWith("local-")) {
      try {
        // Query the root user_trades collection by the trade's backend id
        const q = query(collection(db, "user_trades"), where("id", "==", trade.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {
          await updateDoc(doc(db, "user_trades", d.id), {
            status: "CLOSED",
            exitPrice: lp,
            pnl: pnl
          });
        });
        
        const token = await auth.currentUser.getIdToken();
        await axios.post(`/api/trade/close/${trade.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("[Close] Backend sync failed, position closed locally", err);
      }
    }
    setClosing(null);
  }, [currentPrice, setTrades, setBalance]);

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
            <th className="pb-3 pr-4 font-black">Live PnL</th>
            <th className="pb-3 font-black">Action</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {openTrades.map((trade) => {
              const pnl = calcPnL(trade);
              const isPos = pnl >= 0;
              return (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-3 pr-4 font-black text-white text-[11px]">{trade.asset || trade.symbol}</td>
                  <td className="py-3 pr-4">
                    <span className={`flex items-center gap-1 font-black text-[9px] px-2 py-0.5 rounded-sm ${trade.type === "BUY" ? "bg-[#00FF41]/10 text-[#00FF41]" : "bg-[#FF3131]/10 text-[#FF3131]"}`}>
                      {trade.type === "BUY" ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{trade.lot}</td>
                  <td className="py-3 pr-4 text-gray-400">{trade.leverage ?? 1}x</td>
                  <td className="py-3 pr-4 text-gray-400">${(trade.entryPrice ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className={`py-3 pr-4 font-black text-[12px] ${isPos ? "text-[#00FF41]" : "text-[#FF3131]"}`}>
                    {isPos ? "+" : ""}${pnl.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleClose(trade)}
                      disabled={closing === trade.id}
                      className="flex items-center gap-1 px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-white/10 text-gray-500 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-30"
                    >
                      {closing === trade.id
                        ? <RefreshCw size={8} className="animate-spin" />
                        : <X size={8} />}
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
