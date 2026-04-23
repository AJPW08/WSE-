/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, FirebaseUser, testFirestoreConnection } from '../lib/firebase';
import { User } from '../types';

interface FirebaseContextType {
  user: FirebaseUser | null;
  appUser: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testFirestoreConnection();
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Here we would normally fetch the user profile from /users/{u.uid}
        // For the prototype, we might want to bootstrap it if it doesn't exist
        setAppUser({
          user_id: u.uid,
          user_name: u.displayName || 'User',
          role: 'member',
          licensed: true,
          membership_level: 'Bible Study Plus',
          church_id: 'church_01',
          church_name: 'Immanuel Church'
        });
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const { signInWithPopup, googleProvider } = await import('../lib/firebase');
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    const { signOut } = await import('../lib/firebase');
    await signOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{ user, appUser, loading, signIn, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
