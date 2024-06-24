import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const storedLoggedIn = localStorage.getItem("loggedIn");
        setLoggedIn(storedLoggedIn === "true");
      }, []);
      return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
          {children}
        </AuthContext.Provider>
      );
}