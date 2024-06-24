import "./App.css";
import React, { useEffect, useContext} from "react";
import {BrowserRouter as Router, Route, Routes, useLocation, Navigate} from "react-router-dom";
import Cart from "./View/Cart.jsx";
import Payment from "./View/Payment.jsx";
import Paymentcomplete from "./View/Paymentcomplete";
import Register from "./View/Register";
import CompleteRegister from "./View/CompleteRegister.js"
import Login from "./View/Login";
import Main from "./View/Main";
import AllProduct from "./View/AllProduct.js";
import ProductDetail from "./View/ProductDetail.js";
import BackToTop from "./Components/BackToTop/BackToTop.js";
import { AuthProvider, AuthContext } from "./Utils/AuthContext.js";
import ProtectedRoutes from "./Utils/ProtectedRoutes.js";
import NotAuthRoutes from "./Utils/NotAuthRoutes.js";

// 페이지 이동 시 화면을 맨 위로 스크롤하는 컴포넌트
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // pathname이 변경될 때마다 페이지 맨 위로 스크롤
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes  = () => {
  // 로그인 유무 확인하기
  const { loggedIn } = useContext(AuthContext);
  return (
    <Routes>

    {/* 로그인한 사용자만 접근 가능한 경로 */}
    <Route element={<ProtectedRoutes loggedIn={loggedIn}/>} >
      <Route path="/Cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/paymentcomplete" element={<Paymentcomplete />} />
    </Route>
    

    {/* 비로그인 사용자만 접근 가능한 경로 */}
    <Route element={<NotAuthRoutes loggedIn={loggedIn}/>} >
      <Route path="/register" element={<Register />} />
      <Route path="/complete_register" element={<CompleteRegister />} />
      <Route path="/login" element={<Login />} />
    </Route>
    
    {/* 기본 라우트 */}
    <Route path="/" element={<Main />} />
    <Route path="/product/:categoryId/:subCategoryId/:id" element={<ProductDetail />} />
    <Route path="/product/:categoryId/:subCategoryId" element={<AllProduct />} />
    <Route path="/product/:categoryId" element={<AllProduct />} />

    {/* 정의되지 않은 경로일 경우 로그인 페이지로 리다이렉션 */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>

  );
};
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <AppRoutes />
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
