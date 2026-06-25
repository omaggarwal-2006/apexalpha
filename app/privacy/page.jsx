"use client";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#020205] text-white font-body selection:bg-[#f0c040]/30 p-8 md:p-16 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="text-[#f0c040] font-mono text-xs uppercase tracking-widest hover:underline mb-8 inline-block">
          &larr; Back to Terminal
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Shield className="text-[#f0c040]" size={32} />
          <h1 className="text-3xl md:text-5xl font-header font-black uppercase tracking-wider">Privacy Policy</h1>
        </div>
        <div className="space-y-6 text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-8">
          <p className="text-white text-base font-bold">Last updated: June 25, 2026</p>
          <p>
            At Apex Alpha, accessible from apexalpha.fun, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Apex Alpha and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
          
          <h2 className="text-[#f0c040] text-lg font-black uppercase tracking-wider mt-8">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to apexalpha.fun and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#f0c040] underline">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-[#f0c040] text-lg font-black uppercase tracking-wider mt-8">Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>

          <h2 className="text-[#f0c040] text-lg font-black uppercase tracking-wider mt-8">Privacy Policies</h2>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Apex Alpha, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that Apex Alpha has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="text-[#f0c040] text-lg font-black uppercase tracking-wider mt-8">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  );
}
