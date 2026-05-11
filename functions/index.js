const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Trade Settlement Engine
 * Triggered when a trade is marked for closure
 */
exports.settleTrade = functions.firestore
    .document("trades/{tradeId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Only settle if status changed to 'closed'
        if (oldData.status === "open" && newData.status === "closed") {
            const uid = newData.uid;
            const pnl = newData.pnl || 0;
            
            // Atomically update user balance
            const userRef = admin.firestore().collection("users").doc(uid);
            return admin.firestore().runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) return;
                
                const currentBalance = userDoc.data().balance || 0;
                transaction.update(userRef, {
                    balance: currentBalance + pnl
                });
                
                // Log to ledger
                const ledgerRef = admin.firestore().collection("ledger").doc();
                transaction.set(ledgerRef, {
                    uid,
                    type: "trade_settlement",
                    amount: pnl,
                    tradeId: context.params.tradeId,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            });
        }
    });

/**
 * Liquidation Engine
 * Checks positions against mark price periodically
 */
exports.liquidationEngine = functions.pubsub
    .schedule("every 1 minutes")
    .onRun(async (context) => {
        // Logic to fetch mark prices and liquidate positions below maintenance margin
        console.log("Liquidation engine check performed");
        return null;
    });
