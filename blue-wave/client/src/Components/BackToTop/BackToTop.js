// 맨 위로 올라가는 버튼

import React, { useEffect } from "react";
import "./BackToTop.css";

const BackToTop = () => {
  useEffect(() => {
    const handleScroll = () => {
      const backToTopButton = document.getElementById("back-to-top");
      if (window.scrollY > 100) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a href="#" id="back-to-top" onClick={scrollToTop}>
      ↑
    </a>
  );
};

export default BackToTop;
