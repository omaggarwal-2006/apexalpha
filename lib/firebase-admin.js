/**
 * Firebase Admin SDK — Server-only initializer for Next.js
 * 
 * This module MUST only be imported in server-side code (Server Actions,
 * Route Handlers, Server Components). It will NOT be bundled into the
 * client because it uses Node.js-only modules.
 * 
 * Credential resolution order:
 *  1. FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string — ideal for Vercel)
 *  2. GOOGLE_APPLICATION_CREDENTIALS env var (file path)
 *  3. Default credentials (GCP environments / Firebase emulator)
 */

import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Strategy 1: JSON key from env var (Vercel / CI)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } catch (parseError) {
      console.error('[firebase-admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
    }
  }

  // Strategy 2: File-based credentials (GOOGLE_APPLICATION_CREDENTIALS)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'apex-alpha-sovereign',
    });
  }

  // Strategy 3: Default / emulator fallback
  console.warn('[firebase-admin] No explicit credentials found. Using default initialization.');
  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'apex-alpha-sovereign',
  });
}

const app = initAdmin();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
