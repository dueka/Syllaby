"use client";
// authContext.ts
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    const storedAuthenticated =
      localStorage.getItem("authenticated") === "true";
    if (storedAuthenticated) {
      setAuthenticated(true);
    }
  }, []);

  const login = async (username: any, password: any) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("Login submitted successfully");
        setAuthenticated(true);
        localStorage.setItem("authenticated", "true");
      } else {
        console.error("Login submission failed");
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      console.log("done");
    }
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("authenticated");
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
