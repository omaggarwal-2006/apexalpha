"use client";
import { useLeaderboard } from "@/hooks/useFirestore";
import { TableSkeleton } from "./Skeleton";
import { Award, TrendingUp, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { data: leaders, loading } = useLeaderboard();

  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div className="glass-panel p-6 border-white/5 bg-[#050508] h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-2">
        <Award size={16} className="text-[#f0c040]" />
        <h4 className="text-[12px] font-header font-black uppercase tracking-widest text-white">Global Alpha Rankings</h4>
      </div>

      <div className="flex flex-col gap-3">
        {leaders.map((leader, index) => (
          <motion.div 
            key={leader.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-sm ${
                index === 0 ? "bg-[#f0c040] text-black" : 
                index === 1 ? "bg-gray-300 text-black" : 
                index === 2 ? "bg-[#cd7f32] text-black" : "text-gray-500"
              }`}>
                {index + 1}
              </span>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-wider">{leader.displayName || "Anonymous"}</p>
                <p className="text-[8px] text-gray-600 font-mono">ID: {leader.id.substring(0, 8)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-[#00FF41] mono-nums">${(leader.balance || 0).toLocaleString()}</p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp size={8} className="text-[#00FF41]" />
                <span className="text-[8px] text-gray-500 uppercase font-mono">Alpha Tier</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
