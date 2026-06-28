import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export const metadata = {
  title: "How to Manage Risk in Stock Market Trading — Complete Guide | APEX ALPHA",
  description: "Risk management is the most critical skill in trading. Learn position sizing, stop-loss strategies, risk-reward ratios, and how professional traders protect their capital.",
};

export default function RiskManagementArticle() {
  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans">
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-2xl px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/blog" className="text-[#f0c040] font-mono text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
            <ArrowLeft size={12} /> Back to Blog
          </Link>
          <Link href="/" className="text-gray-500 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">APEX ALPHA</Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-8 py-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-mono font-black uppercase tracking-wider px-2 py-1 border text-blue-400 border-blue-400/30 bg-blue-400/5">Risk Management</span>
          <div className="flex items-center gap-1 text-gray-500 text-xs font-mono"><Clock size={11} /> 8 min read</div>
          <span className="text-gray-600 text-xs font-mono">June 21, 2026</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight text-white mb-6">
          How to Manage Risk in Stock Market Trading — The Complete Guide
        </h1>
        <p className="text-gray-400 text-xl leading-relaxed mb-12 border-l-2 border-[#f0c040] pl-6">
          Risk management is not just a concept — it is the difference between traders who survive and those who blow up their accounts. Master these principles and your trading career will be sustainable for decades.
        </p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed text-base">

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Why Risk Management is the Most Important Trading Skill</h2>
            <p>
              Most beginner traders focus entirely on finding the "perfect entry" — the ideal moment to buy or sell. They study indicators, watch chart patterns, and try to predict market direction. While entry signals matter, they are secondary to a far more critical skill: managing risk.
            </p>
            <p className="mt-4">
              Consider this mathematical reality: if you lose 50% of your trading capital, you need to gain 100% just to break even. A 70% drawdown requires a 233% recovery. These numbers reveal why preserving capital is the absolute first priority of every professional trader.
            </p>
            <p className="mt-4">
              Warren Buffett's two rules of investing are: Rule 1 — Never lose money. Rule 2 — Never forget Rule 1. While some loss is inevitable in trading, controlling the size of those losses is entirely within your power.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">The 1% Rule — The Foundation of Position Sizing</h2>
            <p>
              The most widely used risk management rule among professional traders is the 1% rule: never risk more than 1% of your total trading capital on a single trade. If your account holds ₹1,00,000 (one lakh rupees), you should risk no more than ₹1,000 on any individual trade.
            </p>
            <p className="mt-4">
              This rule has a profound mathematical implication. Even if you execute 20 consecutive losing trades — which is statistically rare with any decent strategy — you would still retain approximately 82% of your starting capital. Your account survives, giving you the opportunity to recover and improve.
            </p>
            <p className="mt-4">
              Conservative traders use 0.5% per trade. Aggressive traders might use 2%. But consistently going above 2% per trade dramatically increases the probability of catastrophic drawdowns that permanently end trading careers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">How to Calculate Position Size Correctly</h2>
            <p>Calculating proper position size requires three inputs:</p>
            <div className="mt-4 space-y-3">
              {[
                ["Account size", "Your total trading capital (e.g., ₹1,00,000)"],
                ["Risk percentage", "How much you are willing to lose on this trade (e.g., 1% = ₹1,000)"],
                ["Stop-loss distance", "The price difference between your entry and your stop-loss (e.g., ₹50 per share)"],
              ].map(([label, desc]) => (
                <div key={label} className="flex items-start gap-4 border border-white/5 bg-white/2 p-4">
                  <span className="text-[#f0c040] font-mono font-black text-sm shrink-0">{label}:</span>
                  <span className="text-gray-400 text-sm">{desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#f0c040]/5 border border-[#f0c040]/20 p-6">
              <p className="text-[#f0c040] font-mono font-black text-sm uppercase tracking-wider mb-3">Formula</p>
              <p className="text-white font-mono text-base">Position Size = Risk Amount ÷ Stop-Loss Distance</p>
              <p className="text-gray-400 text-sm mt-3">Example: ₹1,000 ÷ ₹50 = 20 shares maximum position size</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Stop-Loss Orders — Your Capital's Safety Net</h2>
            <p>
              A stop-loss order is a pre-set instruction to automatically exit a trade if the market moves against you by a specified amount. Setting a stop-loss before entering any trade is not optional — it is mandatory for any trader who wants to survive long-term.
            </p>
            <p className="mt-4">Here are the three most effective stop-loss placement strategies used by professional traders:</p>
            <div className="mt-6 space-y-4">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-white font-black text-lg mb-2">1. Structure-Based Stop-Loss</h3>
                <p className="text-gray-400">Place your stop-loss just below a significant support level (for long positions) or just above a significant resistance level (for short positions). This method is the most logically sound because the stop is placed at a price level where the original trade thesis is definitively invalidated.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-white font-black text-lg mb-2">2. ATR-Based Stop-Loss</h3>
                <p className="text-gray-400">The Average True Range (ATR) measures market volatility. Placing stops at 1.5x to 2x the ATR below your entry ensures your stop is wide enough to account for normal price fluctuations while still being tight enough to limit losses meaningfully.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-white font-black text-lg mb-2">3. Percentage-Based Stop-Loss</h3>
                <p className="text-gray-400">Set a fixed percentage stop from your entry price — for example, exit if the stock falls more than 3% from your purchase price. This is the simplest method and works well for beginners learning risk management fundamentals.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Risk-Reward Ratio — Why 1:2 is the Minimum Standard</h2>
            <p>
              The risk-reward ratio compares how much you stand to lose (your risk) against how much you stand to gain (your reward). A 1:2 risk-reward ratio means for every ₹1 you risk, you aim to make ₹2 in profit.
            </p>
            <p className="mt-4">
              Here is why this matters mathematically: with a 1:2 risk-reward ratio, you only need to win 34% of your trades to be profitable. With a 1:3 ratio, you only need to win 26% of trades. This is the counterintuitive truth that most beginners miss — you do not need to be right most of the time to make money trading. You just need your wins to be larger than your losses.
            </p>
            <p className="mt-4">
              Professional traders typically target minimum risk-reward ratios of 1:2 and ideally 1:3 or better. Never enter a trade where the potential reward is less than twice the potential risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Portfolio-Level Risk — Correlation and Diversification</h2>
            <p>
              Managing individual trade risk is essential, but you must also manage risk at the portfolio level. The most important portfolio-level risk concept is correlation — the degree to which different assets move together.
            </p>
            <p className="mt-4">
              If you hold five long positions in five different technology stocks, you have not truly diversified. If the tech sector falls sharply, all five positions will likely decline together, effectively multiplying your exposure to a single risk factor. True diversification means holding assets with low or negative correlation — for example, combining equities, precious metals, and short-duration bonds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Conclusion: Risk Management is Your Edge</h2>
            <p>
              Every professional trader will tell you that finding good trades is relatively easy — the real challenge is executing those trades with proper risk management consistently over hundreds of trades and years of market participation.
            </p>
            <p className="mt-4">
              Implement the 1% rule, always define your stop-loss before entering a trade, maintain minimum 1:2 risk-reward ratios, and monitor portfolio-level correlation. These four principles alone will put you ahead of 80% of retail traders in the market.
            </p>
            <p className="mt-4">
              Practice these principles systematically using the Apex Alpha paper trading simulator before committing real capital. Build the habit of disciplined risk management when the stakes are virtual, and it will become second nature when real money is on the line.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
          <Link href="/blog/what-is-paper-trading" className="text-gray-500 hover:text-[#f0c040] font-mono text-sm transition-colors">← Paper Trading Guide</Link>
          <Link href="/blog/candlestick-charts-guide" className="text-gray-500 hover:text-[#f0c040] font-mono text-sm transition-colors">Next: Candlestick Charts →</Link>
        </div>
      </article>
    </div>
  );
}
