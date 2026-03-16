// ============================================================
// context/AuthContext.jsx — Authentication Context
// ============================================================
// Provides authentication state (user, token) and methods
// (login, register, logout) to the entire app via React Context.
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the app and provides auth state + methods.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * register() — Create a new account and log in automatically.
   */
  const register = async (name, email, password) => {
    const response = await registerUser({ name, email, password });
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return response.data;
  };

  /**
   * login() — Authenticate and store session.
   */
  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return response.data;
  };

  /**
   * logout() — Clear session and redirect to login.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth() — Custom hook for accessing auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
