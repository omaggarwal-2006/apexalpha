"use client";
import { useEffect, useState } from "react";
import { Globe2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HEADLINES = [
  { id: 1, text: "FED CHAIR POWELL: INFLATION REMAINS ELEVATED, RATE PATH DEPENDENT ON DATA", source: "REUTERS", impact: "HIGH", sentiment: "BEARISH" },
  { id: 2, text: "SEC APPROVES SPOT ETHEREUM ETF — TRADING TO BEGIN NEXT WEEK", source: "BLOOMBERG", impact: "CRITICAL", sentiment: "BULLISH" },
  { id: 3, text: "JAPAN BOJ INTERVENES IN FX MARKET TO SUPPORT WEAK YEN AT ¥158", source: "WSJ", impact: "HIGH", sentiment: "BEARISH" },
  { id: 4, text: "US NON-FARM PAYROLLS BEAT EXPECTATIONS: 275K VS 200K EST — DOLLAR SPIKES", source: "CNBC", impact: "HIGH", sentiment: "BULLISH" },
  { id: 5, text: "OPEC+ EXTENDS VOLUNTARY OIL OUTPUT CUTS THROUGH Q3 2025", source: "FT", impact: "MEDIUM", sentiment: "BULLISH" },
  { id: 6, text: "CHINA PMI MANUFACTURING FALLS TO 47.8, WEAKEST IN 18 MONTHS", source: "XINHUA", impact: "HIGH", sentiment: "BEARISH" },
  { id: 7, text: "BITCOIN BREAKS $100K AS INSTITUTIONAL INFLOWS HIT RECORD $2.4B IN ONE WEEK", source: "COINDESK", impact: "CRITICAL", sentiment: "BULLISH" },
  { id: 8, text: "RBI HOLDS REPO RATE AT 6.5%, MAINTAINS WITHDRAWAL OF ACCOMMODATION STANCE", source: "MINT", impact: "MEDIUM", sentiment: "NEUTRAL" },
  { id: 9, text: "US 10Y TREASURY YIELD SURGES TO 4.8% — EQUITY MARKETS PRESSURED", source: "BARCLAYS", impact: "HIGH", sentiment: "BEARISH" },
  { id: 10, text: "NIFTY 50 HITS ALL-TIME HIGH 25,400 ON FII INFLOWS AND STRONG CORPORATE EARNINGS", source: "ECONOMIC TIMES", impact: "HIGH", sentiment: "BULLISH" },
];

const SENTIMENT_CONFIG = {
  BULLISH: { color: "#00FF41", icon: TrendingUp, label: "BULL" },
  BEARISH: { color: "#FF3131", icon: TrendingDown, label: "BEAR" },
  NEUTRAL: { color: "#888888", icon: Minus, label: "NEUT" },
};

const IMPACT_DOT = {
  CRITICAL: "bg-red-500 animate-pulse",
  HIGH: "bg-[#D4AF37]",
  MEDIUM: "bg-gray-500",
};

export default function MacroTicker() {
  const [tickerItems, setTickerItems] = useState([]);
  const [flashId, setFlashId] = useState(null);

  useEffect(() => {
    setTickerItems([...HEADLINES, ...HEADLINES]); // double for seamless loop

    // Occasionally "break" in a new headline (simulate live feed)
    const breakingInterval = setInterval(() => {
      const randomHeadline = HEADLINES[Math.floor(Math.random() * HEADLINES.length)];
      setFlashId(randomHeadline.id);
      setTimeout(() => setFlashId(null), 3000);
    }, 20000);

    return () => clearInterval(breakingInterval);
  }, []);

  return (
    <div className="w-full h-8 bg-[#080808] border-b border-white/5 flex items-center overflow-hidden font-mono relative z-50">
      {/* Label */}
      <div className="px-3 h-full bg-[#D4AF37] text-black flex items-center gap-1.5 font-black text-[9px] uppercase tracking-widest shrink-0 shadow-[6px_0_20px_rgba(0,0,0,0.6)] z-10">
        <Globe2 size={10} />
        Macro
      </div>

      {/* Breaking News Flash */}
      <AnimatePresence>
        {flashId && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div className="bg-red-600 px-3 h-full flex items-center text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap">
              ⚡ BREAKING
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="absolute inset-0 flex items-center animate-marquee whitespace-nowrap">
          {tickerItems.map((item, i) => {
            const cfg = SENTIMENT_CONFIG[item.sentiment] || SENTIMENT_CONFIG.NEUTRAL;
            const Icon = cfg.icon;
            return (
              <div key={`${item.id}-${i}`} className="inline-flex items-center mx-6 gap-2 shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${IMPACT_DOT[item.impact]}`} />
                <span className="text-[9px] text-gray-500 font-bold shrink-0">[{item.source}]</span>
                <span className="text-[10px] text-white font-medium uppercase tracking-wide">{item.text}</span>
                <span
                  className="flex items-center gap-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 shrink-0"
                  style={{ color: cfg.color, background: cfg.color + "15", border: `1px solid ${cfg.color}30` }}
                >
                  <Icon size={8} />
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
