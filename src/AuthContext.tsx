import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else if (currentUser.email === "janhavidwi7071@gmail.com") {
            // Bootstrap admin role even if doc doesn't exist yet
            setRole('admin');
          } else {
            setRole('user'); // Default to user if doc missing but authenticated
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          if (currentUser.email === "janhavidwi7071@gmail.com") setRole('admin');
          else setRole('user');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
