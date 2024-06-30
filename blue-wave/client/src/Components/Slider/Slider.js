import React, { useState, useEffect, useRef } from "react";
import "./Slider.css"; // 스타일을 위한 CSS 파일

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지고 있는 이미지의 인덱스
  const intervalTime = 3000; // 슬라이드 간격(ms)
  const slideItemsRef = useRef(null); // slideItems의 DOM 요소를 참조하기 위한 ref

  // 자동 슬라이드를 구현하는 useEffect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      // currentIndex를 변경하여 다음 이미지로 넘어가게 한다.
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % slideItemsRef.current.children.length
      );
    }, intervalTime);

    // 컴포넌트가 언마운트 되기 전에 타이머 제거
    // unmount 사용하는 이유?
    // unmount는 뒷정리 함수이며, clearInterval, clearTimeout, 라이브러리 인스턴스 제거
    return () => clearInterval(slideInterval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const slideItems = slideItemsRef.current.children;
    for (let i = 0; i < slideItems.length; i++) {
      slideItems[i].style.display = i === currentIndex ? "block" : "none";
    }
  }, [currentIndex]);

  return (
    <section className="slider">
      <div className="slide" ref={slideItemsRef}>
        <img
          className="slide_img"
          src={process.env.PUBLIC_URL + `/assets/slider/slider1.png`}
          alt="이미지1"
        />
        <img
          className="slide_img"
          src={process.env.PUBLIC_URL + `/assets/slider/slider2.png`}
          alt="이미지2"
        />
        <img
          className="slide_img"
          src={process.env.PUBLIC_URL + `/assets/slider/slider3.png`}
          alt="이미지3"
        />

        <img
          className="slide_img"
          src={process.env.PUBLIC_URL + `/assets/slider/slider4.png`}
          alt="이미지4"
        />

        <img
          className="slide_img"
          src={process.env.PUBLIC_URL + `/assets/slider/slider5.png`}
          alt="이미지5"
        />

        <img
          className="slide_img"
          src={process.env.PUBLIC_URL + `/assets/slider/slider6.png`}
          alt="이미지6"
        />
      </div>
      {/* 이미지 개수만 만큼 동그라미 */}
      <div className="paginations">
        {/* 이미지 개수만큼 동그라미 추가 */}
        {[...Array(slideItemsRef.current?.children.length)].map((_, index) => (
          <span
            key={index}
            className={`pagination-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Slider;
