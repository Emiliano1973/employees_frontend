import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Add a loading state
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedIsAdmin= localStorage.getItem("isAdmin");
    if (storedToken) {
        setToken(storedToken);
        setIsAdmin((storedIsAdmin)?storedIsAdmin:false);  
    } else {
      setToken(null);
      setIsAdmin(false);
    }
    setLoading(false); // Mark loading as complete after setting the token
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, loading, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
