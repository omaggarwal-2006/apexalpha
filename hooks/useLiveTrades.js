"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase-utils";

/**
 * Hook for real-time trade monitoring
 * Subscribes to the trades collection filtered by current user UID
 */
export function useLiveTrades(uid, statusFilter = "open") {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setTrades([]);
      setLoading(false);
      return;
    }

    // Reference to the global trades collection
    const tradesRef = collection(db, COLLECTIONS.TRADES);
    
    // Construct query: Filter by UID, Filter by Status, Order by CreatedAt
    // Note: This requires the composite index [uid: ASC, status: ASC, createdAt: DESC]
    const q = query(
      tradesRef,
      where("uid", "==", uid),
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrades(data);
      setLoading(false);
    }, (err) => {
      console.error("[useLiveTrades] Subscription error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, statusFilter]);

  return { trades, loading, error };
}
