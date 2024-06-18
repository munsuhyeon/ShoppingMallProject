import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa"; // 리액트 아이콘
import "./Header.css"; // 스타일을 위한 CSS 파일

const Header = () => {
  const location = useLocation();

  useEffect(() => {
    const navItems = document.querySelectorAll(".nav_menu li a");

    navItems.forEach((item) => {
      if (item.getAttribute("href") === location.pathname) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }, [location]);

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
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
              <li>
                <Link to="/mypage">
                  <FaUser /> {/* 리액트 아이콘 사용 - My Page */}
                </Link>
              </li>
              <li>
                <Link to="/cart">
                  <FaShoppingCart /> {/* 리액트 아이콘 사용 - cart */}
                </Link>
              </li>
            </ul>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="찾고 싶은 상품을 검색해보세요!" />
            <button type="button">
              <FaSearch /> {/* 리액트 아이콘 사용 - 검색창 */}
            </button>
          </div>
        </div>
      </div>
      <nav className="nav_bar">
        <div className="container">
          <ul className="nav_menu">
            <li className="dropdown">
              <Link to="/category/1">인테리어</Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/category/1/subcategory/1">홈데코</Link>
                </li>
                <li>
                  <Link to="/category/1/subcategory/2">패브릭</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/category/2">디지털</Link>
            </li>
            <li className="dropdown">
              <Link to="/category/3">스포츠</Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/category/3/subcategory/3">의류</Link>
                </li>
                <li>
                  <Link to="/category/3/subcategory/4">신발</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/category/4">도서</Link>
            </li>
            <li>
              <Link to="/category/5">사무용품</Link>
            </li>
            <li>
              <Link to="/category/6">반려동물용품</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
