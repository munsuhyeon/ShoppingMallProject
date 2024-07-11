import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Cart from "./View/Cart.jsx";
import Payment from "./View/Payment.jsx";
import Paymentcomplete from "./View/Paymentcomplete";
import Register from "./View/Register";
import CompleteRegister from "./View/CompleteRegister.js";
import Login from "./View/Login";
import Main from "./View/Main";
import AllProduct from "./View/AllProduct.js";
import ProductDetail from "./View/ProductDetail.js";
import MyPage from "./View/MyPage.js";
import SearchResults from "./View/SearchResults";
import BackToTop from "./Components/BackToTop/BackToTop.js";
import { AuthProvider, AuthContext } from "./Utils/AuthContext.js";
import FindPassword from "./View/FindPassword.js";
import ResetPassword from "./View/ResetPassword.js";
import ChangedPassword from "./View/ChangedPassword.js";
import FindId from "./View/FindId.js";
import FindIdResult from "./View/FindIdResult.js";
import axios from "axios";
import {handleLogout} from "./Utils/Utils.js"
import KakaoLogin from "./Components/Register/KakaoLogin.js";
// import"./App.css"

// 페이지 이동 시 화면을 맨 위로 스크롤하는 컴포넌트
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // pathname이 변경될 때마다 페이지 맨 위로 스크롤
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
// 웹페이지 처음 렌더링 시 전에 로그인한 유저인지 확인 후 
// 토큰이 만료되면 로그아웃 처리하기

const apiUrl = process.env.REACT_APP_HOST;
//console.log(`API URL: ${apiUrl}`);

const AppRoutes = () => {
  const { loggedIn } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/Cart"
        element={loggedIn ? <Cart /> : <Navigate to="/login" />}
      />
      <Route
        path="/payment"
        element={loggedIn ? <Payment /> : <Navigate to="/login" />}
      />
      <Route
        path="/paymentcomplete"
        element={loggedIn ? <Paymentcomplete /> : <Navigate to="/login" />}
      />
      <Route
        path="/myPage"
        element={loggedIn ? <MyPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/register"
        element={loggedIn ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/complete_register"
        element={loggedIn ? <Navigate to="/" /> : <CompleteRegister />}
      />
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/findPassword"
        element={loggedIn ? <Navigate to="/" /> : <FindPassword />}
      />
      <Route
        path="/resetPassword"
        element={loggedIn ? <Navigate to="/" /> : <ResetPassword />}
      />
      <Route
        path="/complete_changePw"
        element={loggedIn ? <Navigate to="/" /> : <ChangedPassword />}
      />
      <Route
        path="/findId"
        element={loggedIn ? <Navigate to="/" /> : <FindId />}
      />
      <Route
        path="/findIdResult"
        element={loggedIn ? <Navigate to="/" /> : <FindIdResult />}
      />
      {/* 기본 라우트 */}
      <Route path="/" element={<Main />} />
      <Route
        path="/product/:categoryId/:subCategoryId/:id"
        element={<ProductDetail />}
      />
      <Route
        path="/product/:categoryId/:subCategoryId"
        element={<AllProduct />}
      />
      <Route
        path="/kakaoLogin"
        element={<KakaoLogin />}
      />
      <Route path="/product/:categoryId" element={<AllProduct />} />
      <Route path="/search" element={<SearchResults />} />
      {/* 정의되지 않은 경로일 경우 메인 페이지로 리다이렉션 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
const App = () => {

  useEffect(() => {
    // 탭 전환에 따른 사용자 토큰 검증
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        //console.log('페이지가 활성화되었습니다.');
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const response = await axios.get(`${process.env.REACT_APP_HOST}/api/verify-token`, {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            });
            if (response.data.valid === false) {
              handleLogout();
            }
          } catch (error) {
            handleLogout();
          }
        }
      }
    };
    // 페이지가 처음 로드될 때 사용자 토큰 검증
    const handleLoad = async () => {
      //console.log('페이지가 로드되었습니다.');
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST}/api/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          if (response.data.valid === false) {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      }
    };
    window.addEventListener('load', handleLoad);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
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
