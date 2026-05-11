import { useRealtimeCollection, useRealtimeDocument } from "./useRealtime";
import { where, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { COLLECTIONS } from "@/lib/firebase-utils";

/**
 * Hook for user trades
 */
export const useTrades = (status = "open") => {
  const { user } = useAuth();
  
  const constraints = [
    where("uid", "==", user?.uid || "none"),
    where("status", "==", status),
    orderBy("createdAt", "desc")
  ];

  return useRealtimeCollection(COLLECTIONS.TRADES, constraints, [user?.uid, status]);
};

/**
 * Hook for user portfolio stats
 */
export const usePortfolio = () => {
  const { user } = useAuth();
  return useRealtimeDocument(`${COLLECTIONS.USERS}/${user?.uid}/portfolio`, "current", [user?.uid]);
};

/**
 * Hook for active predictions
 */
export const usePredictionMarkets = () => {
  const constraints = [
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(20)
  ];
  return useRealtimeCollection(COLLECTIONS.PREDICTION_MARKETS, constraints);
};

/**
 * Hook for global leaderboard
 */
export const useLeaderboard = () => {
  const constraints = [
    orderBy("balance", "desc"),
    limit(10)
  ];
  return useRealtimeCollection(COLLECTIONS.USERS, constraints);
};
