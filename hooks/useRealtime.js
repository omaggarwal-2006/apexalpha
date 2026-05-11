import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { handleFirebaseError } from "@/utils/ErrorHandler";

/**
 * Generic hook for a Firestore collection
 */
export const useRealtimeCollection = (collectionPath, queryConstraints = [], dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionPath), ...queryConstraints);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
      handleFirebaseError(err, `useRealtimeCollection: ${collectionPath}`);
    });

    return () => unsubscribe();
  }, dependencies);

  return { data, loading, error };
};

/**
 * Generic hook for a Firestore document
 */
export const useRealtimeDocument = (collectionPath, documentId, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;
    
    setLoading(true);
    const docRef = doc(db, collectionPath, documentId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setData(null);
      }
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
      handleFirebaseError(err, `useRealtimeDocument: ${collectionPath}/${documentId}`);
    });

    return () => unsubscribe();
  }, [documentId, ...dependencies]);

  return { data, loading, error };
};
