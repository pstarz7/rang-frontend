import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on page refresh
    const savedUser = localStorage.getItem('rangaUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem('rangaUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // store the whole user object including the token
    const userWithToken = { ...userData, token };
    localStorage.setItem('rangaUser', JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const logout = () => {
    localStorage.removeItem('rangaUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);