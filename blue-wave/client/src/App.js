import "./App.css";
import Cart from "./View/Cart.jsx";
import Payment from "./View/Payment.jsx";
import Paymentcomplete from "./View/Paymentcomplete";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Register from "./View/Register";
import Login from "./View/Login";
import Main from "./View/Main";
import AllProduct from "./View/AllProduct.js";
import ProductDetail from "./View/ProductDetail.js";
import BackToTop from "./Components/BackToTop/BackToTop.js";

// 페이지 이동 시 화면을 맨 위로 스크롤하는 컴포넌트
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // pathname이 변경될 때마다 페이지 맨 위로 스크롤
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/product/:categoryId/:subCategoryId/:id"
            element={<ProductDetail />}
          />
          <Route
            path="/product/:categoryId/:subCategoryId"
            element={<AllProduct />}
          />
          <Route path="/product/:categoryId" element={<AllProduct />} />
          <Route path="/" element={<Main />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymentcomplete" element={<Paymentcomplete />} />
        </Routes>
        <BackToTop />
      </div>
    </Router>
  );
};

export default App;
