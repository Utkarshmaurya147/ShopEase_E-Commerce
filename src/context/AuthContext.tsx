"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/api";

// 1. Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// 2. Define what the Context provides
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Add this
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Add the Type to useState
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Because of withCredentials: true, the cookie is sent automatically
        const res = await api.get("/auth/me");
        if (res.data?.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null); // Not logged in or cookie expired
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    await api.post("/auth/logout"); // You'll need a backend route to clear the cookie
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
