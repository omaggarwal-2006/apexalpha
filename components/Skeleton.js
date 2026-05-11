import { motion } from "framer-motion";

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded ${className}`} />
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="glass-panel p-5 h-32 flex flex-col justify-between">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-20 h-2" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-4">
    <div className="flex justify-between border-b border-white/5 pb-2">
      <Skeleton className="w-20 h-3" />
      <Skeleton className="w-20 h-3" />
      <Skeleton className="w-20 h-3" />
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex justify-between items-center py-4 border-b border-white/[0.03]">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-12 h-6" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="w-full h-full glass-panel flex flex-col">
    <div className="p-4 border-b border-white/5 flex justify-between">
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-24 h-4" />
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="w-[80%] h-[60%] border-l border-b border-white/10 relative">
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-tr from-[#f0c040]/5 to-transparent"
        />
      </div>
    </div>
  </div>
);
