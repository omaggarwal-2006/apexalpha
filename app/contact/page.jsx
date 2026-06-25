"use client";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#020205] text-white font-body selection:bg-[#f0c040]/30 p-8 md:p-16 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="text-[#f0c040] font-mono text-xs uppercase tracking-widest hover:underline mb-8 inline-block">
          &larr; Back to Terminal
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Mail className="text-[#f0c040]" size={32} />
          <h1 className="text-3xl md:text-5xl font-header font-black uppercase tracking-wider">Contact Us</h1>
        </div>
        <div className="space-y-6 text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-8">
          <p>
            Have queries, technical feedback, or business inquiries about Apex Alpha?
          </p>
          <p>
            Please feel free to contact us via email. Our team typically responds within 24 to 48 business hours.
          </p>
          <div className="bg-white/5 border border-white/10 p-6 rounded-none mt-4 max-w-md">
            <span className="text-[#f0c040] block font-black uppercase tracking-wider text-xs mb-2">Support Email</span>
            <span className="text-white font-mono text-lg">support@apexalpha.fun</span>
          </div>
        </div>
      </div>
    </div>
  );
}
