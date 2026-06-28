import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BLOG_POSTS } from "@/lib/blogData";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "APEX ALPHA Academy | Quantitative & Trading Blog",
  description: "Explore in-depth articles on technical analysis, market heuristics, risk management, and quantitative finance. Curated by the Apex Alpha research desk.",
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-body selection:bg-[#f0c040]/30 overflow-y-auto relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines z-0" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#f0c040]/3 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navbar wrapper */}
      <div className="px-8 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl z-50">
        <Navbar />
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto p-6 md:p-12 z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#f0c040]/30 bg-[#f0c040]/5 text-[#f0c040] text-[10px] font-mono tracking-[0.3em] uppercase mb-4 rounded-sm">
            <BookOpen size={10} /> Sovereign Research Desk
          </div>
          <h1 className="text-4xl md:text-6xl font-header font-black tracking-tighter uppercase glow-gold text-white">
            Apex Alpha Intelligence
          </h1>
          <p className="text-gray-400 font-mono text-[11px] uppercase tracking-widest mt-2">
            QUANTITATIVE STUDIES // SPECULATORY SYSTEM GUIDES // MARKET INSIGHTS
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug} 
              className="glass-panel p-8 border border-white/5 bg-black/40 hover:border-[#f0c040]/25 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-4">
                  <span className="text-[#f0c040] bg-[#f0c040]/5 px-2.5 py-0.5 border border-[#f0c040]/10 rounded-sm">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} /> {post.date}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl md:text-2xl font-header font-black uppercase tracking-wide text-white group-hover:text-[#f0c040] transition-colors mb-4 line-clamp-2 cursor-pointer">
                    {post.title}
                  </h2>
                </Link>

                {/* Summary */}
                <p className="text-xs text-gray-400 font-mono leading-relaxed mb-6 line-clamp-3">
                  {post.summary}
                </p>
              </div>

              {/* Author & Read More button */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                  <User size={10} className="text-[#f0c040]" />
                  <span>{post.author}</span>
                </div>
                
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#f0c040] uppercase tracking-widest hover:underline group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight size={10} />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Footer Disclaimer */}
      <footer className="border-t border-white/5 bg-black/40 py-8 px-6 mt-16 text-center z-10">
        <div className="max-w-[900px] mx-auto space-y-4">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex justify-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-[9px] font-mono text-gray-600 max-w-[700px] mx-auto leading-relaxed uppercase">
            Disclaimer: APEX ALPHA is a virtual simulation terminal and educational suite. All strategies, calculations, and simulations are mock coordinates running locally inside your browser and do not constitute investment advice, financial planning, or real brokerage activity.
          </p>
          <div className="text-[8px] font-mono text-gray-800 uppercase tracking-[0.4em] select-none">
            © 2026 APEX ALPHA. ALL RIGHTS PRESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
