"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, DollarSign, Loader2, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { auth } from "@/lib/firebase";

const EXCHANGE_RATES = {
  USD: 1,
  JPY: 0.0065,
  GBP: 1.25,
  EUR: 1.08,
  INR: 0.012,
  CNY: 0.14,
  CAD: 0.73,
  KWD: 3.24,
  AED: 0.27
};

export default function ManualFundingModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);

  const handleInject = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Enter a valid injection amount.");
      return;
    }

    const rate = EXCHANGE_RATES[currency] || 1;
    const usdAmount = val * rate;

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post('/api/user/inject-funds', { amount: usdAmount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Liquidity Injected: $${usdAmount.toLocaleString()}`);
      onClose();
      setAmount("");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Injection failed. Check terminal logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#08080F] border border-[#f0c040]/30 overflow-hidden shadow-[0_0_50px_rgba(240,192,64,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0c040]/10 bg-[#f0c040]/5">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-[#f0c040]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  Liquidity Injection Hub
                </span>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col gap-6">
              
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-3">
                  Currency Asset
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f0c040]">
                    <Globe size={18} />
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-black/40 border border-[#f0c040]/20 focus:border-[#f0c040]/50 outline-none text-white text-lg font-mono font-black py-4 pl-12 pr-6 transition-all appearance-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CNY">CNY - Chinese Yuan</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="KWD">KWD - Kuwaiti Dinar</option>
                    <option value="AED">AED - Emirati Dirham</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-3">
                  Injection Amount
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f0c040]">
                    <DollarSign size={20} />
                  </div>
                  <input
                    type="number"
                    autoFocus
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/40 border border-[#f0c040]/20 focus:border-[#f0c040]/50 outline-none text-white text-3xl font-mono font-black py-6 pl-12 pr-6 transition-all"
                  />
                </div>
              </div>

              <div className="bg-[#f0c040]/5 border border-[#f0c040]/10 p-4">
                <p className="text-[9px] text-[#f0c040] font-mono leading-relaxed uppercase tracking-tighter">
                  Warning: Manual injection bypasses standard treasury protocols. Funds will be credited directly to your sovereign vault. Limit 1M USD per 24 hours.
                </p>
              </div>

              <button
                onClick={handleInject}
                disabled={loading || !amount}
                className="w-full h-14 bg-[#f0c040] hover:bg-[#d4ac37] text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Zap size={18} fill="currentColor" />
                    Confirm Injection
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex justify-center">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest font-mono">
                Sovereign Treasury · Alpha Protocol 2.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
