"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Watchlist from "@/components/Watchlist";

export default function MarketWatchPage() {
  const router = useRouter();

  const handleAssetSelect = (symbol) => {
    router.push(`/trade?symbol=${encodeURIComponent(symbol)}`);
  };

  return (
    <div className="min-h-screen text-white bg-[#020205] selection:bg-[#f0c040]/30 font-body flex flex-col">
      {/* Navbar Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl z-50">
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-[#D4AF37] text-2xl font-black tracking-tight uppercase glow-gold">
              Sovereign Market Watch
            </h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">
              Real-time Exchange Feeds & Algorithmic Pulse Indicators
            </p>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            LIVE FEED AGGREGATOR
          </div>
        </div>

        {/* Watchlist Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 h-[600px] max-h-[75vh] glass-panel border-white/10 overflow-hidden shadow-2xl relative flex flex-col"
        >
          {/* Gold circuit decorative line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] scanlines z-0" />
          
          <div className="relative z-10 w-full h-full flex flex-col">
            <Watchlist 
              onAssetSelect={handleAssetSelect} 
              onAction={(type, symbol) => handleAssetSelect(symbol)} 
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
