import axios from "axios";
import React, { useEffect, useState } from "react";

const AuthTimer = () => {
    const token = parseInt(localStorage.getItem('tokenExp')); // 로컬스토리지에 저장한 토큰의 유효시간
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 유무 초기값은 false
    const [tokenTime, setTokenTime] = useState(token); // 토큰 유효시간에서 1초씩 차감하기 위해 유효시간으로 초기화
    const [logoutTime, setLogoutTime] = useState(80); // 로그아웃 시간 초기값 
    let userTime;

    // 로그아웃 타이머 초기화
    const resetLogoutTimer = () => {
        clearLogoutTimer();
        setLogoutTime(75);
    };

    // 토큰 만료 시간 확인 및 처리
    const checkTokenExpiration = async () => {
        if (tokenTime === 60) {
            // 토큰 만료 1분 전, 유저 활동 타이머 종료
            console.log("만료 1분 전");
            if (logoutTime > tokenTime || (logoutTime === 0 && tokenTime > 0) || (logoutTime > 0 && logoutTime < 60)) {
                // 토큰 만료 1분 전에 토큰을 갱신해서 자동 로그인 처리
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const verifyResponse = await axios.get('http://localhost:8000/api/verify-token', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        withCredentials: true
                    });
                    console.log("토큰 검증 요청 상태  ::  " + verifyResponse.status);
                    if (verifyResponse.status === 200) {
                        try {
                            // 토큰 재생성 요청
                            const refreshResponse = await axios.get('http://localhost:8000/api/refresh-token', { withCredentials: true });
                            console.log("토큰 갱신 요청 상태  ::  " + refreshResponse.status);
                            if (refreshResponse.status === 200) {
                                const newToken = refreshResponse.data.newToken;
                                localStorage.removeItem("accessToken"); // 기존 토큰 삭제
                                localStorage.setItem('accessToken', newToken);
                                setTokenTime(token); // 타이머 초기화
                            }
                        } catch (error) {
                            alert("토큰 갱신 실패");
                            handleLogout();
                        }
                    }
                } catch (error) {
                    alert("토큰 검증 실패")
                    console.error(error);
                }
            }
        } else if ((tokenTime === 0 && logoutTime === 0) || (tokenTime === 0 && logoutTime > 0)) {
            // 토큰 만료 및 로그아웃 시간 모두 0일 때 로그아웃 처리
            console.log("로그 아웃");
            handleLogout();
        }
    };

    useEffect(() => {
        if (loggedIn) {
            checkTokenExpiration();
        }
    },[tokenTime])
    // 로그아웃 타이머
    const tokenTimer = () => {
        const timer = setTimeout(() => {
            setTokenTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        setTokenTime(timer);
    };

    // 유저가 활동할 때마다 로그아웃 타이머 초기화
    const resetTimer = () => {
        resetLogoutTimer();
        if (tokenTime === 60 && logoutTime > tokenTime) {
            checkTokenExpiration();
        }
    };

    useEffect(() => {
        if (loggedIn) {
            const intervalToken = setInterval(() => {
                setTokenTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
                setLogoutTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            return () => clearInterval(intervalToken);
        }
    }, [loggedIn]);

    useEffect(() => {
        if (tokenTime === 60) {
            checkTokenExpiration();
        }
    }, [tokenTime]);

    useEffect(() => {
        const storedLoggedIn = localStorage.getItem('loggedIn');
        if (storedLoggedIn) {
            setLoggedIn(true);
            resetLogoutTimer(); // 유저의 활동 타이머 초기화
            checkTokenExpiration();
        }

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
            clearLogoutTimer();
        };
    }, [setLoggedIn]);

    // 로그아웃 타이머 클리어 함수
    const clearLogoutTimer = () => {
        setLogoutTime(0);
    };

    // 초를 시.간.분 으로 표시하는 함수
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? `${h}시간 ` : ""}${m}분 ${s}초`;
    };

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("tokenExp");
        setLoggedIn(false); // 로그인 상태를 false로 설정
        window.location.reload(); // 페이지를 새로 고침
    };

    return (
        <div>
            <h1>시간체크 화면</h1>
            <h1>로그아웃시간: {formatTime(logoutTime)}</h1>
            <h1>토큰만료시간: {formatTime(tokenTime)}</h1>
        </div>
    );
};

export default AuthTimer;
