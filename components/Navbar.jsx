"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logOut } from "@/lib/firebase-utils";
import { motion } from "framer-motion";
import { Globe, Activity, Zap, Headphones, User } from "lucide-react";
import { startAmbientDrone, stopAmbientDrone, playMechanicalClick } from "@/utils/sound";
import { getMarketSession } from "@/utils/marketStatus";
import { usePortfolio } from "@/hooks/useFirestore";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [navBalance, setNavBalance] = useState(100000);
  const { data: portfolio } = usePortfolio();

  const displayBalance = (portfolio?.accountBalance !== undefined && portfolio?.accountBalance !== null)
    ? portfolio.accountBalance
    : navBalance;
  const [marketStatus, setMarketStatus] = useState({
    nse: "REGULAR",
    nyse: "CLOSED",
    crypto: "REGULAR"
  });

  useEffect(() => {
    const localBal = localStorage.getItem("apex_local_balance");
    if (localBal) setNavBalance(parseFloat(localBal));

    const balInterval = setInterval(() => {
      const updated = localStorage.getItem("apex_local_balance");
      if (updated) setNavBalance(parseFloat(updated));
    }, 1500);

    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    }

    // Use our IST-aware market status helper for NSE
    const refreshMarketStatus = () => {
      const nseSession = getMarketSession();
      setMarketStatus(prev => ({
        ...prev,
        nse: nseSession.isOpen ? 'REGULAR' : 'CLOSED',
        nseLabel: nseSession.label,
        crypto: 'REGULAR' // Crypto is always open
      }));
    };
    refreshMarketStatus();
    const statusInterval = setInterval(refreshMarketStatus, 30000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
      clearInterval(balInterval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleDrone = () => {
    playMechanicalClick();
    if (isDroneActive) {
      stopAmbientDrone();
    } else {
      startAmbientDrone();
    }
    setIsDroneActive(!isDroneActive);
  };

  return (
    <motion.nav 
      className="flex justify-between items-center bg-transparent z-50 w-full"
    >
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="text-[#D4AF37] text-2xl font-black tracking-tighter glow-gold transition-all hover:scale-105 active:scale-95 cursor-pointer">
            APEX ALPHA <span className="text-[10px] font-mono border border-[#D4AF37]/30 px-1 bg-[#D4AF37]/10 ml-1 rounded">NG</span>
          </h1>
        </Link>
        
        {/* Market Pulse */}
        <div className="hidden md:flex items-center gap-4 bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-1.5 rounded-full">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${marketStatus.nse === 'REGULAR' ? 'bg-[#00FF94] animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">NSE:</span>
            <span className={`text-[10px] font-bold ${marketStatus.nse === 'REGULAR' ? 'text-[#00FF94]' : 'text-gray-500'}`}>
              {marketStatus.nse === 'REGULAR' ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <div className="w-px h-3 bg-[#222]"></div>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${marketStatus.crypto === 'REGULAR' ? 'bg-[#D4AF37] animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">CRYPTO:</span>
            <span className="text-[10px] font-bold text-[#D4AF37]">24/7</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link href="/market" className="text-white/60 hover:text-[#f0c040] transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Market</Link>
            <Link href="/trade" className="text-white/60 hover:text-[#f0c040] transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Trade</Link>
            <Link href="/portfolio" className="text-white/60 hover:text-[#f0c040] transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Vault</Link>
            <Link href="/audit" className="text-[#f0c040] hover:brightness-125 transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Audit</Link>
            <Link href="/partner" className="text-[#f0c040] hover:brightness-125 transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Partner</Link>
            <Link href="/blog" className="text-white/60 hover:text-[#f0c040] transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Blog</Link>
            <div className="h-5 w-px bg-white/10 mx-2"></div>
            
            {/* Sovereign Soundscapes Focus Synth Toggle */}
            <button
              onClick={toggleDrone}
              title={isDroneActive ? "Mute Sovereign Soundscape" : "Activate Lo-Fi Cyber Focus Soundscape"}
              className={`p-2 border rounded-full transition-all flex items-center justify-center ${isDroneActive ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.35)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
            >
              <Headphones size={13} className={isDroneActive ? 'animate-bounce' : ''} />
            </button>

            <div className="h-5 w-px bg-white/10 mx-2"></div>

            {/* Sovereign Cash Wallet Balance */}
            <div className="flex items-center gap-2 bg-[#FFBF00]/10 border border-[#FFBF00]/20 px-3 py-1.5 rounded-sm">
              <span className="text-[7.5px] font-mono text-[#FFBF00] tracking-[0.2em] font-black">CASH</span>
              <span className="text-[10px] font-mono font-black text-white">
                ${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="h-5 w-px bg-white/10 mx-2"></div>
            <button 
              onClick={handleLogout} 
              className="text-[#f0c040] hover:bg-[#f0c040]/10 font-header font-black text-[10px] border border-[#f0c040]/30 px-6 py-2.5 rounded-none transition-all uppercase tracking-[0.2em]"
            >
              Terminate Session
            </button>

            <div className="h-5 w-px bg-white/10 mx-2"></div>

            {/* Top-Right Circular Profile Avatar */}
            <Link href="/profile" title="Sovereign Profile & Command Center">
              <div className="w-8 h-8 rounded-full border border-[#f0c040]/30 hover:border-[#f0c040] hover:bg-[#f0c040]/20 text-[#f0c040] flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(240,192,64,0.15)] bg-[#f0c040]/5">
                <User size={13} className="text-[#f0c040]" />
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link href="/blog" className="text-white/60 hover:text-[#f0c040] transition font-header font-black text-[10px] uppercase tracking-[0.2em] mr-4">Blog</Link>
            <Link href="/login" className="text-white/60 hover:text-white transition font-header font-black text-[10px] uppercase tracking-[0.2em]">Log In</Link>
            <Link href="/signup" className="glass-panel text-white px-8 py-2.5 font-header font-black text-[10px] uppercase tracking-[0.2em] transition-all border-[#f0c040]/30 hover:border-[#f0c040]">Sign Up</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}

