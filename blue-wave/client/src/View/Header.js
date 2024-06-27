import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation} from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Search from "../Components/Search/Search.js"
import "./Header.css";
import { handleLogout } from "../Utils/Utils";
import { AuthContext} from "../Utils/AuthContext";
import AuthTimer from "../Components/Register/AuthTimer"

const Header = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const path = location.pathname;
    setActiveItem(path);
  }, [location]);

  useEffect(() => {
    const navItems = document.querySelectorAll(".nav_menu li a");

    navItems.forEach((item) => {
      item.classList.remove("active");
      item.classList.add("inactive");
    });

    const activeLink = document.querySelector(
      `.nav_menu li a[href='${activeItem}']`
    );
    if (activeLink) {
      activeLink.classList.add("active");
      activeLink.classList.remove("inactive");
    }
  }, [activeItem]);
  // ================  로그인 인증  ================
  const { loggedIn } = useContext(AuthContext);
 
  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/assets/mainLogo.png" alt="bluewave 로고" />
          </Link>
        </div>
        <div className="nav_container">
          <div className="nav_top">
            <ul className="nav_top_menu">
              {loggedIn ? (
              <>
                <li>
                  <Link to="/" onClick={handleLogout}>로그아웃 <AuthTimer/></Link>
                </li>
                <li>
                  <Link to="/myPage">마이페이지</Link>
                </li>
                
              </>) : (
              <>
                <li>
                  <Link to="/login">로그인</Link>
                </li>
                <li>
                  <Link to="/register">회원가입</Link>
                </li>
              </>)}
              
              <li className={activeItem === "/mypage" ? "active" : ""}>
                <Link to="/mypage">
                  <FaUser />
                </Link>
              </li>
              <li className={activeItem === "/cart" ? "active" : ""}>
                <Link to="/cart">
                  <FaShoppingCart />
                </Link>
              </li>
            </ul>
          </div>
          <div className="search-bar">
          <Search />
          </div>
        </div>
      </div>
      <nav className="nav_bar">
        <div className="container">
          <ul className="nav_menu">
            <li className="dropdown">
              <Link to="/product/1">인테리어</Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/product/1/1">홈데코</Link>
                </li>
                <li>
                  <Link to="/product/1/2">패브릭</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/2/3">디지털</Link>
            </li>
            <li className="dropdown">
              <Link to="/product/3">스포츠</Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/product/3/4">의류</Link>
                </li>
                <li>
                  <Link to="/product/3/5">신발</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/4/6">도서</Link>
            </li>
            <li>
              <Link to="/product/5/7">사무용품</Link>
            </li>
            <li>
              <Link to="/product/6/8">반려동물용품</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
