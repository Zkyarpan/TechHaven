import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Check for token and load user on first render
  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setAuth({ isAuthenticated: false, user: null, loading: false });
        return;
      }

      try {
        // Set Authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Make API request to get user data
        const response = await axios.get("http://localhost:5000/api/auth/user");

        setAuth({
          isAuthenticated: true,
          user: response.data,
          loading: false,
        });
      } catch (error) {
        // Invalid token or other error
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];

        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (userData) => {
    try {
      setAuth({
        ...auth,
        isAuthenticated: true,
        user: userData,
        loading: false,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      // Make API call to register
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // Return success, but don't automatically log them in
      // They'll need to verify their account or login separately
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Remove Authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Update auth state
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
