"use client";

import { createContext, useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import Loading from "@/components/Loading";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userAuth, setUserAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    // return signInWithEmailAndPassword(auth, email, password);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userDocRef, {
      email: userCredential.user.email,
    });

    return userCredential;
  };

  const register = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserAuth(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userUnsub = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });

        return () => {
          userUnsub();
        };
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading className="loading w-screen h-screen" />;
  }

  return (
    <AuthContext.Provider value={{ user, userAuth, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
