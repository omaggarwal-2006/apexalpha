"use client";
import Link from "next/link";
import { Info } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#020205] text-white font-body selection:bg-[#f0c040]/30 p-8 md:p-16 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="text-[#f0c040] font-mono text-xs uppercase tracking-widest hover:underline mb-8 inline-block">
          &larr; Back to Terminal
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Info className="text-[#f0c040]" size={32} />
          <h1 className="text-3xl md:text-5xl font-header font-black uppercase tracking-wider">About Us</h1>
        </div>
        <div className="space-y-6 text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-8">
          <p>
            Welcome to Apex Alpha, an advanced institutional-grade trading terminal simulation environment. 
          </p>
          <p>
            We build state-of-the-art simulators, order-flow dynamics widgets, sentiment heatmaps, and financial analytics platforms. Our goal is to provide sovereign traders with a playground to build, test, and calibrate trading strategies against artificial market makers.
          </p>
          <p>
            Our core architecture leverages Next.js, Framer Motion, Tailwind CSS, and Firebase services to deliver low latency visual updates resembling top-tier prop firm dashboards.
          </p>
          <p>
            Apex Alpha is purely educational and simulation-oriented. No real capital or risk is involved in our simulations.
          </p>
        </div>
      </div>
    </div>
  );
}
