"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

export const useAuth = () => useContext(AuthContext);
