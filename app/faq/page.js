"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { HelpCircle, Terminal, ShieldCheck, Zap, BookOpen, Layers, Lock, Compass } from "lucide-react";

export default function FAQPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const faqs = [
    {
      q: "What is APEX ALPHA and what does the platform do?",
      a: "APEX ALPHA is an institutional-grade paper trading simulation and educational research terminal. It provides interactive market visualizations, technical pattern heuristics, and risk management analytics to help traders develop discipline without risking real capital."
    },
    {
      q: "Are real funds or live brokerage trades involved on APEX ALPHA?",
      a: "No. APEX ALPHA is strictly an educational simulation platform. No real monetary transactions, live brokerage executions, or real financial trades take place. All account balances, order matches, and performance ledgers are 100% virtual."
    },
    {
      q: "How does the paper trading simulation engine work?",
      a: "Our client-side matching engine processes market price feeds and calculates virtual fills, slippage, and PnL metrics inside your browser environment. Your trading performance is continuously evaluated using quantitative ratios like the Sharpe Ratio and Profit Factor."
    },
    {
      q: "Where does the market data and technical indicator information come from?",
      a: "APEX ALPHA pulls public market prices and technical telemetry via open API endpoints. Indicators such as Volatility (VIX), Order Book Imbalances (OBI), and Candlestick Pattern Recognition are calculated in real time using local mathematical algorithms."
    },
    {
      q: "How is my user data and simulation ledger stored?",
      a: "Account authentication is managed securely via Google Firebase. Your virtual trading ledger, active positions, and custom terminal preferences reside locally inside your browser's secure `localStorage` database, ensuring your privacy and data isolation."
    },
    {
      q: "Why does APEX ALPHA display advertisements?",
      a: "We display non-intrusive advertisements (via Google AdSense) to offset the operational costs of maintaining high-frequency data feeds, cloud hosting servers, and continuous algorithmic research."
    },
    {
      q: "Does APEX ALPHA provide financial advice or trading signals?",
      a: "No. APEX ALPHA does not provide personalized investment advice, financial planning, or live trading signals. All educational guides, indicators, and simulation tools are provided purely for research and educational purposes."
    },
    {
      q: "How do I reset my virtual balance or clear my local trade history?",
      a: "You can clear your local trade history and reset your virtual balance at any time by accessing your Profile settings or clearing your browser's local storage data for `apexalpha.fun`."
    },
    {
      q: "What technical topics are covered in the APEX ALPHA Educational Blog?",
      a: "Our educational blog covers quantitative finance topics, including market microstructure, risk management mathematics, option Greeks, backtesting pitfalls, behavioral finance, and macroeconomic liquidity metrics."
    },
    {
      q: "How can I contact the APEX ALPHA development and research team?",
      a: "You can reach out to our research and support team via the Contact page or by emailing our official compliance desk at support@apexalpha.fun."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-body selection:bg-[#f0c040]/30 overflow-y-auto relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines z-0" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#f0c040]/3 rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Navbar */}
      <div className="px-8 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1000px] w-full mx-auto p-6 md:p-12 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="border-b border-white/5 pb-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#f0c040]/30 bg-[#f0c040]/5 text-[#f0c040] text-[10px] font-mono tracking-[0.3em] uppercase mb-4 rounded-sm">
              <HelpCircle size={10} /> Knowledge Base & Intelligence Briefing
            </div>
            <h1 className="text-3xl md:text-5xl font-header font-black tracking-tighter uppercase glow-gold">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500 font-mono text-[11px] uppercase tracking-widest mt-2">
              APEX ALPHA TERMINAL // SIMULATION SCOPE & OPERATIONAL FAQ
            </p>
          </motion.div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} className="glass-panel p-6 border border-white/5 bg-black/40 flex items-start gap-4">
              <ShieldCheck size={20} className="text-[#f0c040] shrink-0 mt-1" />
              <div>
                <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-1">100% SIMULATED</h4>
                <p className="text-[10px] text-gray-500 font-mono leading-relaxed">No real money, brokerage connections, or execution risk.</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 border border-[#f0c040]/15 bg-[#f0c040]/2 flex items-start gap-4">
              <BookOpen size={20} className="text-[#f0c040] shrink-0 mt-1" />
              <div>
                <h4 className="text-[11px] font-mono font-bold text-[#f0c040] uppercase tracking-wider mb-1">EDUCATIONAL FOCUS</h4>
                <p className="text-[10px] text-gray-400 font-mono leading-relaxed">Deep-dive technical guides on risk, math, and market structure.</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 border border-white/5 bg-black/40 flex items-start gap-4">
              <Lock size={20} className="text-[#f0c040] shrink-0 mt-1" />
              <div>
                <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-1">PRIVATE & LOCAL</h4>
                <p className="text-[10px] text-gray-500 font-mono leading-relaxed">Local storage telemetry remains completely in your browser.</p>
              </div>
            </motion.div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="glass-panel p-6 border border-white/5 bg-black/40 hover:border-[#f0c040]/30 transition-all"
              >
                <h3 className="text-xs font-header font-black uppercase text-[#f0c040] tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500">[{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}]</span>
                  {faq.q}
                </h3>
                <p className="text-[11px] text-gray-400 font-mono leading-relaxed pl-6">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Callout */}
          <motion.div variants={itemVariants} className="text-center bg-[#f0c040]/5 border border-[#f0c040]/20 p-6 rounded-none">
            <span className="text-[10px] font-mono text-white block mb-2">HAVE MORE QUESTIONS ABOUT OUR PLATFORM?</span>
            <a href="/contact" className="text-xs font-header font-black text-[#f0c040] hover:text-white transition uppercase tracking-wider">
              CONTACT OUR SUPPORT DESK ▲
            </a>
          </motion.div>

        </motion.div>
      </div>

      <div className="text-center border-t border-white/5 py-8 mt-12">
        <p className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.3em]">
          APEX ALPHA FAQ // KNOWLEDGE BASE // © {new Date().getFullYear()}
        </p>
      </div>
      
      {/* Global scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanlines" />
    </div>
  );
}
