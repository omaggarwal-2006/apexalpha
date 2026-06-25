"use client";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#020205] text-white font-body selection:bg-[#f0c040]/30 p-8 md:p-16 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="text-[#f0c040] font-mono text-xs uppercase tracking-widest hover:underline mb-8 inline-block">
          &larr; Back to Terminal
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <FileText className="text-[#f0c040]" size={32} />
          <h1 className="text-3xl md:text-5xl font-header font-black uppercase tracking-wider">Terms of Service</h1>
        </div>
        <div className="space-y-6 text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-8">
          <p className="text-white text-base font-bold">Last updated: June 25, 2026</p>
          <p>
            Welcome to Apex Alpha! These terms and conditions outline the rules and regulations for the use of Apex Alpha's Website, located at apexalpha.fun.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Apex Alpha if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          
          <h2 className="text-[#f0c040] text-lg font-black uppercase tracking-wider mt-8">License</h2>
          <p>
            Unless otherwise stated, Apex Alpha and/or its licensors own the intellectual property rights for all material on Apex Alpha. All intellectual property rights are reserved. You may access this from Apex Alpha for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Republish material from Apex Alpha</li>
            <li>Sell, rent or sub-license material from Apex Alpha</li>
            <li>Reproduce, duplicate or copy material from Apex Alpha</li>
            <li>Redistribute content from Apex Alpha</li>
          </ul>

          <h2 className="text-[#f0c040] text-lg font-black uppercase tracking-wider mt-8">Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
