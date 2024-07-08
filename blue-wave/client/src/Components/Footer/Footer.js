import React from "react";
import "./Footer.css"; // 스타일을 위한 CSS 파일 임포트

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="inner">
        <ul className="menu">
          <li>
            <a>개인정보처리방침</a>
          </li>
          <li>
            <a>영상정보처리기기 운영관리 방침</a>
          </li>
          <li>
            <a>홈 페이지이용약관</a>
          </li>
          <li>
            <a>위치정보 이용약관</a>
          </li>
          <li>
            <a>윤리경영 핫라인</a>
          </li>
        </ul>

        <div className="info">
          <span>사업자등록번호 111-1234-1234</span>
          <span>(주) BLUEWAVE</span>
          <span>TEL : 032&#41; 1234-5678 / FAX : 032&#41;1234-5678</span>
          <span>개인정보 책임자 : Ezen </span>
        </div>

        <p className="copyright">
          &copy; <span className="this-year">{currentYear}</span> BlueWave
          Company.
        </p>
        <img
          src="assets/lettersLogo.png"
          alt="BlueWave Logo"
          className="logo"
        />
      </div>
    </footer>
  );
};

export default Footer;
