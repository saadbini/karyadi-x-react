import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, verify the token and get fresh user data
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Make an API call to verify token and get fresh user data
        const response = await authAPI.verifyToken();
        setUser(response.data.user);
      } catch (error) {
        console.error('Auth verification failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (userData, token) => {
    if (!token) {
      console.error('No token provided');
      return;
    }

    try {
      localStorage.setItem("token", token);
      // Only store the token in localStorage, get user data from API
      setUser(userData);
    } catch (error) {
      console.error('Error storing auth data:', error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user // Add isAuthenticated computed value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
