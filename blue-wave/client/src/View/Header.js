import React, { useEffect, useState } from "react";
import "./Header.css"
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import verifyToken from '../Utils/Auth.js';

const Header = () => {
  const navigate = useNavigate(); 
  const [loggedIn, setLoggedIn] = useState(false);
  // 1. 일정 시간이 지나면 자동 로그아웃 시키려면 남은 로그아웃 시간과 로그아웃 타이머를 관리해야 합니다.
  // 시간 데이터 상태를 관리하는 useState기능을 활용하였습니다.
  const [logoutTimer, setLogoutTimer] = useState(null); // 로그아웃 타이머를 관리하는 state
  const [timeLeft, setTimeLeft] = useState(3600); // 남은 시간을 초 단위로 관리하는 state. 초기값은 1시간 입니다

  // 2. 초기 시간을 배분하고 1시간이 지나면
  // setTimeout 내장 함수를 이용하여 기존에 있는 handleLogout로 유저를 로그아웃 시킵니다
  const resetLogoutTimer = () => {
    clearLogoutTimer();
    setTimeLeft(3600); // 타이머를 1시간으로 초기화
    const timer = setTimeout(handleLogout, 3600000); // 1시간 후에 handleLogout 호출
    setLogoutTimer(timer);
  };

  const checkTokenExpiration = () => {
    const expirationTime = localStorage.getItem("accessTokenExpiration"); //토큰만료시간
    if(expirationTime && Date.now() > expirationTime - 60000){
      verifyToken().then(() => {
        // 만료 시간 설정 (예: 1시간 후)
        const newExpirationTime = Date.now() + 3600 * 1000;
        localStorage.setItem("accessTokenExpiration",newExpirationTime);
        resetLogoutTimer();
      }).catch(() => {
        handleLogout();
      })
    }
  }

  // 3. 로그인 상태일 시 1시간을 측정하기 위해, useState안의 setTimeLeft 데이터를 1초씩 감소시킨다
  // 시간이 모두 지나면 clearInterval을 통해서 setInterval로 시간을 측정하는 작업을 멈춘다
  useEffect(() => {
    if (loggedIn) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [loggedIn]);

  // 4. 그런데 유저가 쇼핑을 하는데 로그아웃을 시키면 안되니까 
  // 페이지가 로드될 때 마다 사용자의 활동을 감지하여
  // useEffect의 새로고침 기능을 통해서 유저의 활동이 있을 때 시간 데이터를 리셋해야 합니다
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');

    if (storedLoggedIn) {
      setLoggedIn(true); // 로그인 상태라면 loggedIn을 true로 설정

      // 로그인 상태를 감지할 때 로그아웃 타이머를 초기화 해야합니다
      resetLogoutTimer(); // 로그인 상태라면 로그아웃 타이머 초기화
    }

    // 5. 사용자 활동을 감지하여 로그아웃 타이머를 리셋
    // 키보드나 마우스의 움직임으로 사용자의 활동이 멈춘 상태인지를 확인합니다.
    const resetTimer = () => resetLogoutTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    // 6. 컴포넌트 언마운트 시 이벤트 리스너 제거
    // 프로그램 종료 시 키보드와 마우스 움직임 체크를 멈춥니다.
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearLogoutTimer();
    };
  }, [setLoggedIn]);

  // 7. 로그아웃 타이머 클리어 함수
  const clearLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

   // 8. 유저가 알아볼 수 있는 시분초를 나타내는 함수입니다.
   const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}시간 ` : ""}${m}분 ${s}초`;
  };

  // 로그아웃 시 세션 스토리지에서 로그인 상태 제거
  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    setLoggedIn(false); // 로그인 상태를 false로 설정
    // axios 헤더에서 Authorization 제거
    delete axios.defaults.headers.common['authorization'];
    navigate("/"); //로그아웃 후 메인 페이지로 이동
    window.location.reload(); // 페이지를 새로 고침
  };

  // accessToken갱신
  const newAccessToken = async () => {
    try{
      const response = await axios.post('http://localhost:8000/')
    }
  }


    return(
        <div className="Header">
            <header>

        <div className="container">
          <div className="logo">
            <a href="#"
              ><img src={process.env.PUBLIC_URL + `assets/mainLogo.png`} alt="bluewave_logo"
            /></a>
          </div>

          <div>
            <div className="nav_top">
              <ul className="nav_top_menu">
                {loggedIn ? (
                  <>
                  <li><a onClick={handleLogout}>로그아웃</a></li>
                  <li><a href="회원가입.html">마이페이지</a></li>
                  <li>자동 로그아웃까지 남은 시간: {formatTime(timeLeft)}</li>
                  </>
                
                ) : 
                (
                <>
                <li><Link to={"/login"}>로그인</Link></li>
                <li><Link to={"/register"}>회원가입</Link></li>
                </>)
                }
                
                <li>
                  <a href="">
                    <i className="fa-solid fa-user"></i>
                  </a>
                </li>
                <li>
                  <a href=""><i className="fa-solid fa-cart-shopping"></i></a>
                </li>
              </ul>
            </div>
  

            <div className="search-bar">
              <input type="text" placeholder="찾고 싶은 상품 검색해보세요!" />
              <button type="button">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </div>

        <nav className="nav_bar">
          <div className="container">
            <ul className="nav_menu">
              <li><a href="">홈인테리어</a></li>
              <li><a href="">가전디지털</a></li>
              <li><a href="">스포츠/레저</a></li>
              <li><a href="">서적</a></li>
              <li><a href="">문구/완구</a></li>
              <li><a href="">반려동물용품</a></li>
            </ul>
          </div>
        </nav>
      </header>
        </div>
    )
}
export default Header;