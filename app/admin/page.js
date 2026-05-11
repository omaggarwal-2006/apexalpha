"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { TableSkeleton } from "@/components/Skeleton";
import { ShieldCheck, User, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [trades, setTrades] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Basic admin check (can be improved with custom claims or roles in Firestore)
    if (user && (user.email === "admin@apexalpha.io" || user.uid === "ADMIN_UID_HERE")) {
      setIsAdmin(true);
      fetchAdminData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchAdminData = async () => {
    try {
      const tradesQuery = query(collection(db, "trades"), orderBy("createdAt", "desc"), limit(20));
      const usersQuery = query(collection(db, "users"), limit(20));

      const [tradesSnap, usersSnap] = await Promise.all([
        getDocs(tradesQuery),
        getDocs(usersQuery)
      ]);

      setTrades(tradesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="p-20 text-center font-mono">AUTHENTICATING ADMIN PRIVILEGES...</div>;
  
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020205] text-red-500 font-mono p-10">
      <div className="flex flex-col items-center gap-4 border border-red-500/20 p-10 bg-red-500/5">
        <AlertCircle size={40} />
        <h1 className="text-xl font-black uppercase tracking-widest">ACCESS DENIED</h1>
        <p className="text-xs opacity-60">Sovereign Admin privileges required for this terminal.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-white font-body px-6 py-8">
      <Navbar />
      
      <div className="max-w-7xl mx-auto mt-12 flex flex-col gap-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3 bg-[#f0c040]/10 border border-[#f0c040]/30 text-[#f0c040]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-header font-black uppercase tracking-widest">Global Command Center</h1>
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mt-1">Institutional Audit & Supervision Terminal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Inspection */}
          <div className="glass-panel p-6 border-white/5 bg-[#050508]">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <User size={16} className="text-[#f0c040]" />
              <h2 className="text-[12px] font-header font-black uppercase tracking-widest">User Directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead className="text-gray-600 uppercase">
                  <tr className="border-b border-white/5">
                    <th className="pb-3">Identity</th>
                    <th className="pb-3">Balance</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="text-white">{u.displayName || "Anonymous"}</span>
                          <span className="text-[8px] opacity-40">{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3 text-[#00FF41]">${(u.balance || 0).toLocaleString()}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] border border-emerald-500/20">ACTIVE</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Inspection */}
          <div className="glass-panel p-6 border-white/5 bg-[#050508]">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <TrendingUp size={16} className="text-[#f0c040]" />
              <h2 className="text-[12px] font-header font-black uppercase tracking-widest">Global Order Book</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead className="text-gray-600 uppercase">
                  <tr className="border-b border-white/5">
                    <th className="pb-3">Asset</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Leverage</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map(t => (
                    <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                      <td className="py-3 text-white font-black">{t.asset}</td>
                      <td className="py-3">
                        <span className={t.type === "BUY" ? "text-[#00FF41]" : "text-[#FF3131]"}>{t.type}</span>
                      </td>
                      <td className="py-3">{t.leverage}x</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[8px] border ${
                          t.status === "open" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-gray-500 border-white/10"
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
