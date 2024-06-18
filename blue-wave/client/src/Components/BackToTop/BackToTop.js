// 맨 위로 올라가는 버튼

import React, { useEffect } from "react";
import "./BackToTop.css";

const BackToTop = () => {
  useEffect(() => {
    const handleScroll = () => {
      // 맨 위로 올라가는 버튼 요소를 가져옵니다.
      const backToTopButton = document.getElementById("back-to-top");
      // 현재 스크롤 위치가 임계값보다 크면
      if (window.scrollY > 100) {
        // 버튼에 'show' 클래스를 추가하여 보이게 합니다.
        backToTopButton.classList.add("show");
      } else {
        // 현재 스크롤 위치가 임계값보다 작거나 같으면
        // 버튼에서 'show' 클래스를 제거하여 숨깁니다.
        backToTopButton.classList.remove("show");
      }
    };
    // 컴포넌트가 마운트될 때 한 번 실행되는 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // 빈 배열을 전달하여, 이펙트가 컴포넌트가 마운트될 때 한 번만 실행되도록 설정
  }, []);

  // 맨 위로 올라가는 함수 정의
  const scrollToTop = (e) => {
    e.preventDefault(); // 기본 링크 클릭 동작 방지
    // 부드러운 스크롤을 사용하여 페이지 맨 위로 이동합니다.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a href="#" id="back-to-top" onClick={scrollToTop}>
      ↑
    </a>
  );
};

export default BackToTop;
