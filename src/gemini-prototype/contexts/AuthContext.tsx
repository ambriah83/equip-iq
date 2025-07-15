import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data for the prototype
const MOCK_USER: User = { name: "Ambriah", role: "Owner" };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session on app load
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const login = (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setUser(MOCK_USER);
        setLoading(false);
        resolve(true);
      }, 500);
    });
  };

  const logout = () => setUser(null);

  const value = { user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};