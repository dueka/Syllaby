"use client";
// authContext.ts
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState(
    window.localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuthenticated =
        localStorage.getItem("authenticated") === "true";
      if (storedAuthenticated) {
        setAuthenticated(true);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 200) {
        console.log("Login submitted successfully");
        setAuthenticated(true);
        const responseBody = await response.json();
        console.log("Response body:", responseBody);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("role", responseBody.user?.role);
        return response;
      } else {
        console.error("Login submission failed");
        throw new Error("Login submission failed");
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
    localStorage.removeItem("role");
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
