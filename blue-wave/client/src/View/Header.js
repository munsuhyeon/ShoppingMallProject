import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import "./Header.css";

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
              <li>
                <a href="로그인.html">로그인</a>
              </li>
              <li>
                <Link to="/register">회원가입</Link>
              </li>
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
            <input type="text" placeholder="찾고 싶은 상품을 검색해보세요!" />
            <button type="button">
              <FaSearch />
            </button>
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
