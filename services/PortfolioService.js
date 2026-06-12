import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, writeBatch, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase-utils";

/**
 * Update user portfolio based on trade data
 */
export const updateUserPortfolio = async (uid) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const balance = userData.balance || 0;

    // Fetch all closed trades for this user
    const tradesQuery = query(
      collection(db, COLLECTIONS.TRADES),
      where("uid", "==", uid),
      where("status", "==", "closed")
    );
    const tradesSnap = await getDocs(tradesQuery);
    const closedTrades = tradesSnap.docs.map(doc => doc.data());

    // Fetch open trades for active positions count
    const openTradesQuery = query(
      collection(db, COLLECTIONS.TRADES),
      where("uid", "==", uid),
      where("status", "==", "open")
    );
    const openTradesSnap = await getDocs(openTradesQuery);
    const activePositions = openTradesSnap.size;

    // Calculations
    const totalTrades = closedTrades.length;
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0).length;
    const realizedPnL = closedTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const portfolioData = {
      realizedPnL,
      winRate,
      totalTrades,
      activePositions,
      accountBalance: balance,
      totalEquity: balance + realizedPnL, // Simplified for now, unrealized handled by live hooks
      updatedAt: new Date().toISOString()
    };

    // Store under users/{uid}/portfolio/current
    const portfolioRef = doc(db, COLLECTIONS.USERS, uid, "portfolio", "current");
    await setDoc(portfolioRef, portfolioData, { merge: true });

    return portfolioData;
  } catch (error) {
    console.error("Error updating user portfolio:", error);
    throw error;
  }
};

/**
 * Subscribe to portfolio updates
 */
export const subscribeToPortfolio = (uid, callback) => {
  const portfolioRef = doc(db, COLLECTIONS.USERS, uid, "portfolio", "current");
  return onSnapshot(portfolioRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  });
};


