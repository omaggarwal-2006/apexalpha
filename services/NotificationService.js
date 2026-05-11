import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase-utils";

/**
 * Service for managing platform notifications
 */
export const NotificationService = {
  /**
   * Send a notification to a specific user
   */
  send: async (uid, notification) => {
    try {
      await addDoc(collection(db, COLLECTIONS.USERS, uid, "notifications"), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  },

  /**
   * Subscribe to user notifications
   */
  subscribe: (uid, callback) => {
    const q = query(
      collection(db, COLLECTIONS.USERS, uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(notifications);
    });
  }
};
