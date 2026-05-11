import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "./firebase";

// --- Collection Constants ---
export const COLLECTIONS = {
  USERS: "users",
  TRADES: "user_trades",
  BETS: "bets",
  LEDGER: "ledger",
  PREDICTION_MARKETS: "prediction_markets"
};

// --- Auth Helpers ---

/**
 * Sign up a new user
 */
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName || "",
      createdAt: serverTimestamp(),
      balance: 10000, // Initial balance
    });
    
    return user;
  } catch (error) {
    console.error("Error in signUp:", error);
    throw error;
  }
};

/**
 * Log in an existing user
 */
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error in logIn:", error);
    throw error;
  }
};

/**
 * Log out current user
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error in logOut:", error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore, if not create
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        balance: 10000,
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error in googleSignIn:", error);
    throw error;
  }
};

// --- Firestore CRUD Helpers ---

/**
 * Add a document to a collection
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a single document
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error);
    throw error;
  }
};

// --- Real-time Listener Helpers ---

/**
 * Subscribe to a collection with filters
 */
export const subscribeToCollection = (collectionName, queryConstraints = [], callback) => {
  const q = query(collection(db, collectionName), ...queryConstraints);
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    console.error(`Error subscribing to ${collectionName}:`, error);
  });
};

/**
 * Subscribe to a specific document
 */
export const subscribeToDocument = (collectionName, docId, callback) => {
  return onSnapshot(doc(db, collectionName, docId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to document ${docId} in ${collectionName}:`, error);
  });
};

// --- Specific Collection Helpers ---

/**
 * Subscribe to user trades
 */
export const subscribeToUserTrades = (uid, callback) => {
  return subscribeToCollection(
    COLLECTIONS.TRADES, 
    [where("uid", "==", uid), orderBy("createdAt", "desc")], 
    callback
  );
};

/**
 * Subscribe to user bets
 */
export const subscribeToUserBets = (uid, callback) => {
  return subscribeToCollection(
    COLLECTIONS.BETS, 
    [where("uid", "==", uid), orderBy("createdAt", "desc")], 
    callback
  );
};

/**
 * Subscribe to prediction markets
 */
export const subscribeToPredictionMarkets = (callback) => {
  return subscribeToCollection(
    COLLECTIONS.PREDICTION_MARKETS,
    [where("status", "==", "active")],
    callback
  );
};

/**
 * Add a new trade
 */
export const createTrade = (tradeData) => {
  return addDocument(COLLECTIONS.TRADES, tradeData);
};

/**
 * Update a trade status
 */
export const updateTrade = (tradeId, updateData) => {
  return updateDocument(COLLECTIONS.TRADES, tradeId, updateData);
};

/**
 * Add a ledger entry
 */
export const addLedgerEntry = (entryData) => {
  return addDocument(COLLECTIONS.LEDGER, entryData);
};
