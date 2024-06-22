// 제품 상세에서 고정되는 네비게이션입니다
// 상품상세, 리뷰, 반품/배송정보

import React, { useEffect } from "react";
import "./FixedNavbar.css";

const FixedNavbar = () => {
  useEffect(() => {
    const handleScroll = () => {
      // 네비게이션 바 요소를 선택
      const headerEl = document.querySelector(".ProductInfo-navbar");
      // 현재 스크롤 위치를 가져오기 (크로스 브라우저 대응)
      const scrollY = window.scrollY || window.pageYOffset;
      // 네비게이션 바를 고정시킬 스크롤 임계값 설정
      const threshold = 1000;
      // 스크롤 위치가 임계값을 초과하면
      if (scrollY > threshold) {
        // 네비게이션 바에 'fixed' 클래스 추가하여 고정
        headerEl.classList.add("fixed");
      } else {
        // 스크롤 위치가 임계값 이하면
        // 네비게이션 바에서 'fixed' 클래스 제거하여 일반 상태로 복원
        headerEl.classList.remove("fixed");
      }
    };
    // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너 제거
      window.removeEventListener("scroll", handleScroll);
    };
    // 빈 배열을 전달하여, 이펙트가 컴포넌트가 마운트될 때 한 번만 실행되도록 설정
  }, []);

  return (
    <nav className="ProductInfo-navbar">
      <div className="ProductInfo-navdiv">
        <ul className="ProductInfo-menu">
          <li>
            <a href="#ProductInfo-Section">상품 상세</a>
          </li>
          <li>
            <a href="#Review">리뷰</a>
          </li>
          <li>
            <a href="#Information">반품/교환 정보</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default FixedNavbar;
