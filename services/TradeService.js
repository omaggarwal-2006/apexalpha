import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase-utils";
import { handleFirebaseError } from "@/utils/ErrorHandler";
import { updateUserPortfolio } from "./PortfolioService";
import { NotificationService } from "./NotificationService";

/**
 * Service for handling trade execution and lifecycle
 */
export const TradeService = {
  /**
   * Execute a new trade
   */
  executeTrade: async (uid, tradeData) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Create trade document (Use provided ID if available for consistency)
      const tradeRef = tradeData.id 
        ? doc(db, COLLECTIONS.TRADES, tradeData.id)
        : doc(collection(db, COLLECTIONS.TRADES));
        
      const finalTradeData = {
        ...tradeData,
        uid,
        status: "open",
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      };
      batch.set(tradeRef, finalTradeData);

      // 2. Create ledger entry
      const ledgerRef = doc(collection(db, COLLECTIONS.LEDGER));
      batch.set(ledgerRef, {
        uid,
        type: "trade_execution",
        tradeId: tradeRef.id,
        amount: -(tradeData.margin || 0),
        asset: tradeData.asset,
        timestamp: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      });

      await batch.commit();
      
      // 3. Send Notification
      NotificationService.send(uid, {
        title: "Order Executed",
        message: `${tradeData.type} ${tradeData.lot} lots of ${tradeData.asset} at $${tradeData.entryPrice}`,
        type: "success"
      });

      // 4. Trigger async portfolio refresh
      updateUserPortfolio(uid);
      
      return tradeRef.id;
    } catch (error) {
      handleFirebaseError(error, "TradeService.executeTrade");
      throw error;
    }
  },

  /**
   * Close an existing trade
   */
  closeTrade: async (uid, tradeId, exitData) => {
    try {
      const tradeRef = doc(db, COLLECTIONS.TRADES, tradeId);
      await updateDoc(tradeRef, {
        ...exitData,
        status: "closed",
        closedAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });

      // Trigger async portfolio refresh
      updateUserPortfolio(uid);

      // Send Notification
      NotificationService.send(uid, {
        title: "Position Closed",
        message: `Closed ${tradeId.substring(0, 8)}... with PnL: $${exitData.pnl.toFixed(2)}`,
        type: exitData.pnl >= 0 ? "success" : "error"
      });
    } catch (error) {
      handleFirebaseError(error, "TradeService.closeTrade");
      throw error;
    }
  }
};
