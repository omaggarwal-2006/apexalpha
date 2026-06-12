'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';

/**
 * Retrieves the authenticated user's balance from Firestore.
 * Server-only — verifies Firebase ID token via Admin SDK.
 *
 * @param {string} idToken — Firebase ID token from the client
 * @returns {{ success: boolean, balance: number, equity: number, error?: string }}
 */
export async function getUserBalance(idToken) {
  try {
    if (!idToken || typeof idToken !== 'string') {
      return { success: false, balance: 0, equity: 0, error: 'No token provided.' };
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      const seed = { balance: 10000, createdAt: new Date().toISOString(), uid, email: decoded.email || '' };
      await adminDb.collection('users').doc(uid).set(seed);
      return { success: true, balance: seed.balance, equity: seed.balance };
    }

    const userData = userDoc.data();
    const balance = userData.balance ?? 0;

    let equity = balance;
    try {
      const portfolioDoc = await adminDb.collection('users').doc(uid).collection('portfolio').doc('current').get();
      if (portfolioDoc.exists) {
        equity = portfolioDoc.data().totalEquity ?? balance;
      }
    } catch (_) { /* fallback to raw balance */ }

    return { success: true, balance: Number(balance), equity: Number(equity) };
  } catch (error) {
    console.error('[getUserBalance]', error.message);
    const isAuth = error.code?.startsWith?.('auth/');
    return {
      success: false, balance: 0, equity: 0,
      error: isAuth ? 'Authentication failed. Sign in again.' : 'Balance retrieval failed.',
    };
  }
}

/**
 * Returns a read-only portfolio summary for the authenticated user.
 * @param {string} idToken
 */
export async function getPortfolioSummary(idToken) {
  try {
    if (!idToken || typeof idToken !== 'string') {
      return { success: false, error: 'No token provided.' };
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const doc = await adminDb.collection('users').doc(uid).collection('portfolio').doc('current').get();
    if (!doc.exists) {
      return { success: true, data: { realizedPnL: 0, winRate: 0, totalTrades: 0, activePositions: 0, accountBalance: 0, totalEquity: 0 } };
    }

    const d = doc.data();
    return {
      success: true,
      data: {
        realizedPnL: d.realizedPnL ?? 0,
        winRate: d.winRate ?? 0,
        totalTrades: d.totalTrades ?? 0,
        activePositions: d.activePositions ?? 0,
        accountBalance: d.accountBalance ?? 0,
        totalEquity: d.totalEquity ?? 0,
      },
    };
  } catch (error) {
    console.error('[getPortfolioSummary]', error.message);
    return { success: false, error: 'Portfolio retrieval failed.' };
  }
}
