import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const storedLoggedIn = localStorage.getItem("loggedIn");
        setLoggedIn(storedLoggedIn === "true");
        
        if (storedLoggedIn) {
          const storedUserId = localStorage.getItem("userId");
          const storedUserName = localStorage.getItem("userName");
          setUserId(storedUserId);
          setUserName(storedUserName)
        }
      }, []);
      return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userId, userName }}>
          {children}
        </AuthContext.Provider>
      );
}