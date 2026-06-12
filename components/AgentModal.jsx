"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Play, Terminal, Cpu } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function AgentModal({ isOpen, onClose, currentPrice, balance, onExecuteAction }) {
  const { user } = useAuth();
  const [script, setScript] = useState(
    "// Write your JS Strategy\n// Variables available: price, balance\n// Functions available: buy(), sell(), log(msg)\n\nif (price < 50000) {\n  log('Price is low, executing buy');\n  buy();\n} else {\n  log('Holding position');\n}"
  );
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  if (!isOpen) return null;

  const handleRun = async () => {
    setLoading(true);
    setLogs([]);
    try {
      const token = await user.getIdToken();
      const res = await axios.post("http://localhost:3001/api/agent/execute", {
        script,
        currentPrice,
        balance
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLogs(res.data.logs || []);
      
      if (res.data.action === "BUY") {
        toast.success("Agent recommended BUY!");
        onExecuteAction("BUY");
      } else if (res.data.action === "SELL") {
        toast.success("Agent recommended SELL!");
        onExecuteAction("SELL");
      } else {
        toast("Agent evaluated: HOLD", { icon: "🤖" });
      }
    } catch (err) {
      setLogs(prev => [...prev, "Error: " + (err.response?.data?.error || err.message)]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#08080F] border border-[#f0c040]/30 shadow-[0_0_50px_rgba(240,192,64,0.1)] font-mono flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-[#f0c040]">
            <Cpu size={18} />
            <span className="font-black tracking-[0.2em] uppercase text-sm">Agentic Strategy Sandbox</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="bg-black/50 border border-white/10 rounded-lg p-2">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-48 bg-transparent text-[#00FF94] outline-none resize-none font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <div className="h-24 bg-black border border-white/10 overflow-y-auto p-2 text-[10px] text-gray-400">
            <div className="flex items-center gap-2 text-white/50 mb-1"><Terminal size={12}/> Output Console</div>
            {logs.map((l, i) => <div key={i} className="text-gray-300">&gt; {l}</div>)}
          </div>

          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full py-3 bg-[#f0c040] hover:bg-[#f0c040]/80 text-black font-black tracking-widest uppercase flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Evaluating..." : <><Play size={16} /> Execute Strategy</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
