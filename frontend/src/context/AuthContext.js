// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from "../axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on mount (if cookie is valid)
  useEffect(() => {
    axiosInstance.get("/api/auth/profile", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    await axiosInstance.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("user");
  };

  const isEmployer = user?.role === "employer";
  const isCandidate = user?.role === "candidate";

  return (
    <AuthContext.Provider value={{ user, login, logout, isEmployer, isCandidate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
