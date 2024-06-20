import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Header.css"
import {Link, useNavigate} from 'react-router-dom';
import verifyToken from './../Utils/Auth.js';

const Header = () => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  // 유저의 활동 타이머 1시간으로 설정
  const [timeLeft, setTimeLeft] = useState(3600);
  const [logoutTimer, setLogoutTimer] = useState(null); // 로그아웃 타이머를 관리하는 state

  const fetchToken = async () => {
    try {
      await verifyToken({ setIsAuth }); 
    } catch (error) {
      console.error("토큰 검증 중 오류 발생:", error);
    }
  };

  useEffect(()=>{
    if(isAuth){ // isAuth=true 로그인상태
      // 로그인 상태일 시 1시간을 측정하기 위해, useState안의 setTimeLeft 데이터를 1초씩 감소시킨다
      // 시간이 모두 지나면 clearInterval을 통해서 setInterval로 시간을 측정하는 작업을 멈춘다
        const intervalId = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        clearInterval(intervalId);
      
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
  },[setIsAuth]);

  // 초기 시간을 배분하고 1시간이 지나면
  // setTimeout 내장 함수를 이용하여 기존에 있는 handleLogout로 유저를 로그아웃 시킵니다
  const resetLogoutTimer = () => {
    clearLogoutTimer();
    setTimeLeft(3600); // 타이머를 1시간으로 초기화
    const timer = setTimeout(handleLogout, 3600000); // 1시간 후에 handleLogout 호출
    setLogoutTimer(timer);
  };
  
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

  const handleLogout = () => {
    // 로컬 스토리지에서 accessToken 삭제
    localStorage.removeItem('access_token');

    // axios 헤더에서 Authorization 제거
    delete axios.defaults.headers.common['authorization'];
    alert("로그아웃되었습니다")
    navigate('/');
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
                {isAuth ? (
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