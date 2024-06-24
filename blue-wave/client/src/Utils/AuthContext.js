import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedLoggedIn = localStorage.getItem("loggedIn");
        setLoggedIn(storedLoggedIn === "true");
        
        if (storedLoggedIn) {
          const storedUserId = localStorage.getItem("userId");
          setUserId(storedUserId);
        }
      }, []);
      return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userId }}>
          {children}
        </AuthContext.Provider>
      );
}