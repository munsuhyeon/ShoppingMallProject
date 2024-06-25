import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleLogout, formatTime} from "../../Utils/Utils";

const AuthTimer = () => {
    const tokenExp = parseInt(localStorage.getItem('tokenExp')); // 로컬스토리지에 저장한 토큰의 유효시간
    const tokenIat = parseInt(localStorage.getItem('tokenIat'));
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 계산
    const initialTokenTime  = tokenExp ? (tokenExp - currentTime) : 0; // 토큰 유효시간 초기화
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 유무 초기값은 false
    const [tokenTime, setTokenTime] = useState(initialTokenTime ); // 토큰 유효시간에서 1초씩 차감하기 위해 유효시간으로 초기화
    const [logoutTime, setLogoutTime] = useState(3600); // 로그아웃 시간 1시간 초기화 

    // 토큰 만료 시간 확인 및 처리
    const checkTokenExpiration = async () => {
        if(tokenTime === 60){ // 로그인 후 화면이 처음 렌더링하면 실행되지 않게 조건추가
            // 토큰 만료 1분 전에 토큰을 갱신해서 자동 로그인 처리
            try {
                const accessToken = localStorage.getItem('accessToken');
                const verifyResponse = await axios.get('http://localhost:8000/api/verify-token', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true
                });
                if (verifyResponse.status === 200) {
                    try {
                        // 토큰 갱신 요청
                        const refreshResponse = await axios.get('http://localhost:8000/api/refresh-token', { withCredentials: true });
                        if (refreshResponse.status === 200) {
                            const newToken = refreshResponse.data.newToken;
                            localStorage.removeItem("accessToken"); // 기존 토큰 삭제
                            localStorage.setItem('accessToken', newToken);
                            setTokenTime(initialTokenTime ); // 타이머 초기화
                            console.log("토큰 갱신 성공")
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
        };
    }

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
        /*  토큰 만료 1분전 갱신 여부 체크하기
            1. 활동시간이 0이 아니면 토큰 갱신
            2. 활동시간이 0인데 토큰시간이 남았다면 갱신하지 않기
            3. 토큰시간이 0이면 활동시간이 남았더라고 로그아웃
        */
        if(tokenTime === 0){
            handleLogout();
        }
        if (tokenTime === 60) {
            if( logoutTime > 0 )
            checkTokenExpiration();
        }
    }, [tokenTime]);

    useEffect(() => {
        const storedLoggedIn = localStorage.getItem('loggedIn');
        if (storedLoggedIn) {
            setLoggedIn(true);
            setLogoutTime(70); // 유저의 활동 타이머 초기화
            checkTokenExpiration();
        }

        window.addEventListener("mousemove", setLogoutTime(3600));
        window.addEventListener("keypress", setLogoutTime(3600));

        return () => {
            window.removeEventListener("mousemove", setLogoutTime(3600));
            window.removeEventListener("keypress", setLogoutTime(3600));
            setLogoutTime(0);
        };
    }, [setLoggedIn]);

    return (
        <>
            {/*<li style={{fontSize:'14px', fontWeight:'bold'}}>로그아웃시간: {formatTime(logoutTime)}</li>*/}
            <span style={{fontSize:'14px', fontWeight:'bold'}}>{formatTime(tokenTime)}</span> {/*토큰만료시간 타이머*/}
        </>
    );
};

export default AuthTimer;