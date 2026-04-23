/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, query, where, onSnapshot, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection Test
export async function testFirestoreConnection() {
  try {
    // Attempt to read a dummy doc to verify connectivity
    await getDocFromServer(doc(db, '_system_', 'health'));
    console.log("Firebase connection established.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase connection failed: Client is offline.");
    }
  }
}

// Utility to handle Firestore errors as requested
export function handleFirestoreError(error: any, operationType: string, path: string | null = null) {
  const authInfo = auth.currentUser ? {
    userId: auth.currentUser.uid,
    email: auth.currentUser.email || '',
    emailVerified: auth.currentUser.emailVerified,
    isAnonymous: auth.currentUser.isAnonymous,
    providerInfo: auth.currentUser.providerData.map(p => ({
      providerId: p.providerId,
      displayName: p.displayName || '',
      email: p.email || '',
    }))
  } : null;

  const errorDetail = {
    error: error.message || 'Unknown Firestore Error',
    operationType,
    path,
    authInfo
  };

  throw new Error(JSON.stringify(errorDetail));
}

export { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, doc, getDocFromServer, collection, query, where, onSnapshot, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp, addDoc };
export type { FirebaseUser };
