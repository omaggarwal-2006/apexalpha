"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Users, Building2, Network, ChevronRight, ShieldCheck } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-body selection:bg-[#f0c040]/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Institutional Partnerships
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 glow-gold uppercase">
              Alpha Syndicate
            </h1>
            <p className="text-gray-400 font-mono text-[11px] uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              Connect your firm to the Apex Alpha execution core. Institutional API access, white-label solutions, and liquidity provider programs.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all group bg-black/40"
            >
              <div className="h-12 w-12 bg-white/5 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Network className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" size={24} />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-widest text-white mb-3">API Access</h3>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed mb-6 h-16">
                Direct FIX and REST API connections for algorithmic execution and sub-millisecond latency.
              </p>
              <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors">
                Request Keys <ChevronRight size={12} />
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all group bg-[#D4AF37]/5 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.05)]"
            >
              <div className="absolute top-0 right-0 p-2">
                 <ShieldCheck size={16} className="text-[#D4AF37]" />
              </div>
              <div className="h-12 w-12 bg-[#D4AF37]/10 flex items-center justify-center rounded-sm mb-6">
                <Building2 className="text-[#D4AF37]" size={24} />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-widest text-white mb-3">White Label</h3>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed mb-6 h-16">
                Deploy the Apex Alpha terminal infrastructure for your proprietary trading desk or hedge fund.
              </p>
              <button className="w-full py-3 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                Contact Sales
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all group bg-black/40"
            >
              <div className="h-12 w-12 bg-white/5 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Users className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" size={24} />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-widest text-white mb-3">Liquidity Program</h3>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed mb-6 h-16">
                Join our dark pool network. Favorable maker fee structures for qualifying market makers.
              </p>
              <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors">
                Apply Now <ChevronRight size={12} />
              </button>
            </motion.div>

          </div>

          <div className="mt-16 text-center border-t border-white/5 pt-8">
            <p className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.3em]">
              Apex Alpha Sovereign Systems © {new Date().getFullYear()} // Secure Encrypted Network
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
