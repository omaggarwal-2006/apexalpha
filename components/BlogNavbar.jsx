// Static server-component navbar for public/blog pages.
// No "use client", no Firebase, no hooks — fully SSR-compatible.
import Link from "next/link";

export default function BlogNavbar() {
  return (
    <nav className="flex justify-between items-center bg-transparent z-50 w-full">
      <div className="flex items-center gap-6">
        <Link href="/">
          <span className="text-[#D4AF37] text-2xl font-black tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
            APEX ALPHA{" "}
            <span className="text-[10px] font-mono border border-[#D4AF37]/30 px-1 bg-[#D4AF37]/10 ml-1 rounded">
              NG
            </span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <Link
          href="/about"
          className="text-white/60 hover:text-[#f0c040] transition font-black text-[10px] uppercase tracking-[0.2em]"
        >
          About
        </Link>
        <Link
          href="/blog"
          className="text-[#f0c040] font-black text-[10px] uppercase tracking-[0.2em]"
        >
          Blog
        </Link>
        <Link
          href="/faq"
          className="text-white/60 hover:text-[#f0c040] transition font-black text-[10px] uppercase tracking-[0.2em]"
        >
          FAQ
        </Link>
        <Link
          href="/learn"
          className="text-white/60 hover:text-[#f0c040] transition font-black text-[10px] uppercase tracking-[0.2em]"
        >
          Learn
        </Link>
        <Link
          href="/contact"
          className="text-white/60 hover:text-[#f0c040] transition font-black text-[10px] uppercase tracking-[0.2em]"
        >
          Contact
        </Link>
        <div className="h-4 w-px bg-white/10" />
        <Link
          href="/login"
          className="text-white/60 hover:text-white transition font-black text-[10px] uppercase tracking-[0.2em]"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="border border-[#f0c040]/30 hover:border-[#f0c040] text-white px-5 py-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
