"use client";
import { useState, useEffect } from "react";
import { TradeService } from "@/services/TradeService";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/useFirestore";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, AlertCircle, ToggleLeft, ToggleRight, X, TrendingUp, TrendingDown, Cpu } from "lucide-react";
import { playMechanicalClick } from "@/utils/sound";
import AgentModal from "./AgentModal";

const ASSETS = [
  { symbol: "^NSEI",      name: "Nifty 50",   category: "Indices" },
  { symbol: "^NSEBANK",   name: "Bank Nifty", category: "Indices" },
  { symbol: "^GSPC",      name: "S&P 500",    category: "Indices" },
  { symbol: "^IXIC",      name: "NASDAQ 100", category: "Indices" },
  { symbol: "BTC-USD",    name: "Bitcoin",    category: "Crypto" },
  { symbol: "ETH-USD",    name: "Ethereum",   category: "Crypto" },
  { symbol: "SOL-USD",    name: "Solana",     category: "Crypto" },
  { symbol: "RELIANCE.NS",name: "Reliance",   category: "NSE" },
  { symbol: "TCS.NS",     name: "TCS",        category: "NSE" },
  { symbol: "HDFCBANK.NS",name: "HDFC Bank",  category: "NSE" },
  { symbol: "INFY.NS",    name: "Infosys",    category: "NSE" },
  { symbol: "NVDA",       name: "Nvidia",     category: "US Tech" },
  { symbol: "TSLA",       name: "Tesla",      category: "US Tech" },
  { symbol: "AAPL",       name: "Apple",      category: "US Tech" },
  { symbol: "GC=F",       name: "Gold",       category: "Commodities" },
  { symbol: "CL=F",       name: "Crude Oil",  category: "Commodities" },
  { symbol: "USDINR=X",   name: "USD/INR",    category: "Forex" },
];

const LEVERAGE_OPTIONS = [5, 50, 100, 150, 200];

function calcFees(tradeValue) {
  const stt       = tradeValue * 0.001;
  const brokerage = Math.min(20, tradeValue * 0.0003);
  const gst       = brokerage * 0.18;
  return { stt, brokerage, gst, total: stt + brokerage + gst };
}

// ── Execution Modal ──────────────────────────────────────────
function ExecutionModal({ type, selectedAsset, currentPrice, balance, onConfirm, onClose }) {
  const [lot, setLot]           = useState("1");
  const [leverage, setLeverage] = useState(200);
  const [brokerageEnabled, setBrokerageEnabled] = useState(true);

  const lotVal      = parseFloat(lot) || 0;
  const safePrice   = currentPrice || 1;
  const tradeValue  = lotVal * safePrice;
  const margin      = tradeValue / leverage;
  const fees        = brokerageEnabled ? calcFees(tradeValue) : null;
  const totalCost   = margin + (fees?.total ?? 0);
  const insufficient = type === "BUY" && balance < totalCost;

  const isBuy = type === "BUY";
  const accent = isBuy ? "#00FF41" : "#FF3131";
  const accentDim = isBuy ? "rgba(0,255,65,0.15)" : "rgba(255,49,49,0.15)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm mx-4 bg-[#08080F] border font-mono overflow-hidden"
        style={{ borderColor: accent + "44", boxShadow: `0 0 40px ${accentDim}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: accent + "22" }}>
          <div className="flex items-center gap-3">
            {isBuy
              ? <TrendingUp size={18} style={{ color: accent }} />
              : <TrendingDown size={18} style={{ color: accent }} />
            }
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">
              {isBuy ? "Long / Buy" : "Short / Sell"}
            </span>
            <span className="text-[9px] text-gray-600 uppercase tracking-widest">{selectedAsset}</span>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition">
            <X size={16} />
          </button>
        </div>

        {/* Price strip */}
        <div className="px-6 py-3 bg-white/[0.02] flex justify-between items-center border-b border-white/5">
          <span className="text-[9px] text-gray-600 uppercase tracking-widest">Market Price</span>
          <span className="text-sm font-black text-white">${(safePrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Lots */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Lots / Quantity</label>
              <div className="flex gap-2">
                {["25", "50", "MAX"].map(pc => (
                  <button
                    key={pc}
                    onClick={() => {
                      const factor = pc === "MAX" ? 1 : parseFloat(pc) / 100;
                      setLot(((balance * leverage * factor) / safePrice).toFixed(4));
                    }}
                    className="text-[8px] font-black px-2 py-0.5 bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition uppercase"
                  >
                    {pc === "MAX" ? "MAX" : `${pc}%`}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="0"
              step="0.0001"
              value={lot}
              onChange={e => setLot(e.target.value)}
              className="w-full bg-black/60 border border-white/10 focus:border-white/30 outline-none text-white text-2xl font-black text-center py-4 transition"
            />
          </div>

          {/* Leverage */}
          <div>
            <label className="text-[9px] text-gray-500 uppercase tracking-widest font-black block mb-2">Leverage</label>
            <div className="grid grid-cols-5 gap-2">
              {LEVERAGE_OPTIONS.map(lv => (
                <button
                  key={lv}
                  onClick={() => setLeverage(lv)}
                  className="py-2 text-[10px] font-black uppercase tracking-wider border transition-all"
                  style={{
                    background: leverage === lv ? accentDim : "transparent",
                    borderColor: leverage === lv ? accent : "rgba(255,255,255,0.08)",
                    color: leverage === lv ? accent : "#4b5563",
                    boxShadow: leverage === lv ? `0 0 10px ${accentDim}` : "none",
                  }}
                >
                  {lv}x
                </button>
              ))}
            </div>
            {leverage >= 100 && (
              <p className="mt-2 text-[8px] text-red-400 font-black uppercase tracking-widest text-center animate-pulse">
                ⚠ Liquidation within {(0.9 / leverage * 100).toFixed(1)}% price move
              </p>
            )}
          </div>

          {/* Fee toggle */}
          <div className="flex items-center justify-between py-3 border-t border-b border-white/5">
            <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Brokerage Fees</span>
            <button onClick={() => setBrokerageEnabled(p => !p)}>
              {brokerageEnabled
                ? <ToggleRight size={20} className="text-white" />
                : <ToggleLeft size={20} className="text-gray-700" />}
            </button>
          </div>

          {/* Summary */}
          <div className="text-[9px] font-mono flex flex-col gap-1.5 text-gray-500">
            <div className="flex justify-between"><span>TRADE VALUE</span><span className="text-white">${tradeValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span>MARGIN REQ.</span><span className="text-white">${margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            {fees && <div className="flex justify-between"><span>FEES</span><span className="text-red-400">-${fees.total.toFixed(2)}</span></div>}
            <div className="flex justify-between border-t border-white/5 pt-1.5 font-black">
              <span className="text-white uppercase">TOTAL DEDUCTION</span>
              <span style={{ color: insufficient ? "#FF3131" : accent }}>${totalCost.toFixed(2)}</span>
            </div>
          </div>

          {insufficient && (
            <div className="flex items-center gap-2 text-[9px] text-red-400 font-black uppercase border border-red-500/20 bg-red-500/5 py-2 px-3">
              <AlertCircle size={11} /> Insufficient balance
            </div>
          )}

          {/* Confirm */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={insufficient || lotVal <= 0}
            onClick={() => onConfirm({ lot: lotVal, leverage, brokerageEnabled, fees })}
            className="w-full py-4 font-black text-[12px] uppercase tracking-[0.25em] disabled:opacity-30 transition-all"
            style={{
              background: accent,
              color: isBuy ? "#000" : "#fff",
              boxShadow: `0 8px 30px ${accentDim}`,
            }}
          >
            Confirm {isBuy ? "Buy" : "Sell"} · {leverage}x
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main OrderPanel ──────────────────────────────────────────
export default function OrderPanel({
  balance: propBalance,
  selectedAsset,
  onAssetChange,
  slPrice,
  tpPrice,
  currentPrice,
  isLocked,
  lockTime,
  isTrailing,
  setIsTrailing,
  onTrade,
  setActiveInsight = () => {},
}) {
  const { user } = useAuth();
  const { data: portfolio } = usePortfolio();
  
  // Safety check: use hook balance if available, fallback to prop, fallback to 0
  const safeBalance = portfolio?.accountBalance ?? propBalance ?? 0;
  const balance = safeBalance;
  const displayBalance = balance;
  
  const [loading, setLoading]   = useState(false);
  const [isPanic, setIsPanic]   = useState(false);
  const [modal, setModal]       = useState(null); // "BUY" | "SELL" | null
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  const safePrice  = currentPrice || 1;
  const estProfit  = tpPrice > 0 ? (Math.abs(tpPrice - safePrice) * 1).toFixed(2) : "0.00";
  const estLoss    = slPrice  > 0 ? (Math.abs(safePrice - slPrice)  * 1).toFixed(2) : "0.00";
  const isPreset   = ASSETS.some(a => a.symbol === selectedAsset);
  const categories = [...new Set(ASSETS.map(a => a.category))];

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  async function handleCloseAll() {
    setIsPanic(true);
    if (onTrade) onTrade();
    toast.loading("Initiating Global Liquidation...");
    setTimeout(() => {
      const local = localStorage.getItem("apex_local_trades");
      let arr = [];
      try { arr = JSON.parse(local || "[]"); } catch {}
      let refund = 0, closed = 0;
      const updated = arr.map(t => {
        if (t.status === "OPEN") {
          closed++;
          const lp = currentPrice || t.entryPrice || 100;
          refund += lp * t.lot;
          const pnl = (t.type === "BUY" ? lp - t.entryPrice : t.entryPrice - lp) * t.lot - (t.fees?.total ?? 0);
          return { ...t, status: "CLOSED", exitPrice: lp, pnl };
        }
        return t;
      });
      toast.dismiss();
      if (closed > 0) {
        const nb = balance + refund;
        setBalance(nb);
        localStorage.setItem("apex_local_balance", nb.toString());
        setOptimisticTrades(updated);
        localStorage.setItem("apex_local_trades", JSON.stringify(updated));
        toast.success(`Liquidated ${closed} position(s).`);
      } else {
        toast.error("No open positions to liquidate.");
      }
      setIsPanic(false);
    }, 1200);
  }

  async function executeTrade(type, { lot, leverage, brokerageEnabled, fees }) {
    setModal(null);
    if (onTrade) onTrade();

    const tempId     = `trade-${Date.now()}`;
    const entryPrice = safePrice;
    const tradeValue = lot * entryPrice;
    const margin     = tradeValue / leverage;
    const feesTotal  = fees?.total ?? 0;

    setLoading(true);
    try {
      // 1. Sync with backend if needed
      let backendTradeId = null;
      try {
        const token = await user.getIdToken();
        const res = await axios.post("/api/trade", { type, lot, asset: selectedAsset, brokerageEnabled, leverage }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        backendTradeId = res.data.tradeId;
      } catch (backendErr) {
        console.warn("Backend sync skipped/failed", backendErr);
      }

      // 2. Persist to Firestore via Service
      await TradeService.executeTrade(user.uid, {
        type,
        lot,
        asset: selectedAsset,
        entryPrice,
        leverage,
        margin,
        fees: feesTotal,
        id: backendTradeId || tempId,
        uid: user.uid,
        status: "open",
      });

      toast.success(`${type} executed successfully.`);
    } catch (err) {
      console.error("Trade execution failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 h-full flex flex-col font-body relative overflow-hidden bg-[#020205]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-[0.02] blur-[100px] rounded-full -mr-24 -mt-24 pointer-events-none" />

      {/* Lock overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-[#020205]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="p-6 border border-white/30 text-white mb-6"><ShieldCheck size={40} /></div>
            <h3 className="text-white font-header font-black text-[11px] uppercase tracking-[0.4em] mb-4">Discipline Protocol Active</h3>
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-10 max-w-[200px] leading-loose">Daily liquidation threshold breached. Access revoked.</p>
            <span className="text-5xl font-black font-mono text-white tracking-tighter">{formatTime(lockTime)}</span>
            <span className="text-[8px] text-gray-700 uppercase font-header font-black tracking-[0.5em] mt-4">Cool-off Matrix</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution Modal */}
      <AnimatePresence>
        {modal && (
          <ExecutionModal
            type={modal}
            selectedAsset={selectedAsset}
            currentPrice={currentPrice}
            balance={balance}
            onClose={() => setModal(null)}
            onConfirm={(params) => executeTrade(modal, params)}
          />
        )}
      </AnimatePresence>

      <div className={`flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar pb-4 ${isLocked ? "blur-sm grayscale opacity-30 select-none pointer-events-none" : ""}`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-white/30 text-white"><Zap size={15} /></div>
            <div>
              <h2 className="text-white font-header font-black text-[11px] uppercase tracking-[0.2em]">Execution Terminal</h2>
              <p className="text-[8px] text-gray-700 font-mono uppercase tracking-widest mt-0.5">Vanguard Alpha v6.2 · 200x Protocol</p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className={`text-[9px] font-header font-black uppercase px-4 py-2 border transition-all ${isPanic ? "bg-[#FF3131] text-white border-[#FF3131] animate-pulse" : "bg-black text-[#FF3131] border-[#FF3131]/30 hover:bg-[#FF3131]/10"}`}
          >
            Liquidate All
          </button>
        </div>

        {/* TP/SL Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/[0.02] border border-white/5 hover:border-[#00FF41]/30 transition-all">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[8px] text-gray-600 uppercase font-header font-black tracking-widest">TP Target</p>
              <p className="text-[8px] text-[#00FF41] font-mono font-black">+${estProfit}</p>
            </div>
            <p className="text-lg text-white font-mono font-black tracking-tighter">${tpPrice || "0.00"}</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 hover:border-[#FF3131]/30 transition-all">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[8px] text-gray-600 uppercase font-header font-black tracking-widest">SL Floor</p>
              <p className="text-[8px] text-[#FF3131] font-mono font-black">-${estLoss}</p>
            </div>
            <p className="text-lg text-white font-mono font-black tracking-tighter">${slPrice || "0.00"}</p>
          </div>
        </div>

        {/* Asset Selector */}
        <div className="mb-6">
          <label className="text-[9px] text-gray-700 uppercase font-header font-black tracking-[0.2em] block mb-3">Asset Matrix</label>
          <div className="relative">
            <select
              value={isPreset ? selectedAsset : "custom"}
              onChange={e => onAssetChange(e.target.value)}
              className="w-full p-4 bg-black/80 border border-white/10 focus:outline-none focus:border-white/30 text-white text-[11px] font-header font-black tracking-[0.1em] appearance-none cursor-pointer uppercase transition-all"
            >
              {categories.map(cat => (
                <optgroup key={cat} label={cat.toUpperCase()} className="bg-[#020205] text-white">
                  {ASSETS.filter(a => a.category === cat).map(asset => (
                    <option key={asset.symbol} value={asset.symbol} className="text-white">{asset.name}</option>
                  ))}
                </optgroup>
              ))}
              {!isPreset && <option value="custom">{selectedAsset}</option>}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">
              <ShieldCheck size={14} />
            </div>
          </div>
        </div>

        {/* Balance Display */}
        <div className="mb-6 p-4 bg-white/[0.02] border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-600 uppercase font-header font-black tracking-widest flex-shrink-0">Available Capital</span>
            <span className={`font-mono font-black text-white text-right truncate ml-2 ${displayBalance > 999999999 ? 'text-sm' : displayBalance > 999999 ? 'text-base' : 'text-xl'}`}>
              ${displayBalance >= 1e12 ? (displayBalance / 1e12).toFixed(2) + 'T'
                : displayBalance >= 1e9 ? (displayBalance / 1e9).toFixed(2) + 'B'
                : displayBalance >= 1e6 ? (displayBalance / 1e6).toFixed(2) + 'M'
                : displayBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-[8px] text-gray-700 uppercase tracking-widest mt-2 font-mono truncate">
            Leverage up to 200x · Max notional: ${(displayBalance * 200) >= 1e12 ? ((displayBalance * 200) / 1e12).toFixed(1) + 'T' : (displayBalance * 200).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
        </div>

        {/* Trailing Stop */}
        <div className={`mb-4 p-4 border transition-all ${isTrailing ? "border-white/20 bg-white/5" : "border-white/5 bg-white/[0.01]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isTrailing ? "bg-white shadow-[0_0_8px_#fff] animate-pulse" : "bg-gray-800"}`} />
              <span className="text-[10px] font-header font-black uppercase tracking-[0.2em] text-white">Trailing Stop</span>
            </div>
            <button onClick={() => setIsTrailing(prev => !prev)}>
              {isTrailing
                ? <ToggleRight size={24} className="text-white" />
                : <ToggleLeft size={24} className="text-gray-800 hover:text-gray-600" />}
            </button>
          </div>
          {isTrailing && (
            <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-2">Dynamic profit capture active · 1% offset</p>
          )}
        </div>
      </div>

      {/* Primary Buy / Sell Buttons */}
      <div className="pt-6 border-t border-white/5 bg-[#020205]">
        <div className="flex justify-between items-center px-1 mb-4">
          <span className="text-[9px] text-gray-600 font-header font-black uppercase tracking-widest">Market Price</span>
          <span className="text-[13px] text-white font-mono font-black">
            ${safePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading || isLocked}
            onClick={() => { setActiveInsight("BULLISH_HOVER"); setModal("BUY"); }}
            onMouseLeave={() => setActiveInsight("IDLE")}
            className="relative overflow-hidden disabled:opacity-30 font-header font-black tracking-[0.2em] uppercase transition-all py-5 flex flex-col items-center justify-center gap-1"
            style={{ background: "#00FF41", color: "#000", boxShadow: "0 10px 30px rgba(0,255,65,0.2)" }}
          >
            <TrendingUp size={16} />
            <span className="text-[13px]">BUY</span>
            <span className="text-[8px] opacity-60">Long · Up to 200x</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading || isLocked}
            onClick={() => { setActiveInsight("BEARISH_HOVER"); setModal("SELL"); }}
            onMouseLeave={() => setActiveInsight("IDLE")}
            className="relative overflow-hidden disabled:opacity-30 font-header font-black tracking-[0.2em] uppercase transition-all py-5 flex flex-col items-center justify-center gap-1"
            style={{ background: "#FF3131", color: "#fff", boxShadow: "0 10px 30px rgba(255,49,49,0.2)" }}
          >
            <TrendingDown size={16} />
            <span className="text-[13px]">SELL</span>
            <span className="text-[8px] opacity-60">Short · Up to 200x</span>
          </motion.button>
        </div>

        <button 
          onClick={() => setIsAgentOpen(true)}
          className="w-full mt-4 py-3 bg-[#f0c040]/10 border border-[#f0c040]/30 hover:bg-[#f0c040]/20 text-[#f0c040] font-black uppercase tracking-[0.3em] flex justify-center items-center gap-2 transition-colors text-[10px]"
        >
          <Cpu size={14} /> Launch Agentic Strategy
        </button>
      </div>

      <AgentModal 
        isOpen={isAgentOpen} 
        onClose={() => setIsAgentOpen(false)} 
        currentPrice={safePrice} 
        balance={displayBalance} 
        onExecuteAction={(action) => setModal(action)} 
      />
    </div>
  );
}
