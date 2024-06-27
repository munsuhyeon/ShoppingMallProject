import React, { createContext, useState, useEffect } from "react";

// =====================    userId, userName을 전역적으로 관리    =====================
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(() => {
      const storedLoggedIn = localStorage.getItem("loggedIn");
      return storedLoggedIn ? true : false
    });
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
      // 로컬 스토리지에서 저장된 로그인 정보를 읽어와 상태를 설정
      const storedLoggedIn = localStorage.getItem("loggedIn");
        if (storedLoggedIn === "true") {
          setUserId(localStorage.getItem("userId"));
          setUserName(localStorage.getItem("userName"))
        } 
      }, []);
      return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userId, userName }}>
          {children}
        </AuthContext.Provider>
      );
};