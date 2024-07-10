import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleLogout, formatTime} from "../../Utils/Utils";

const AuthTimer = () => {
    const tokenExp = parseInt(localStorage.getItem('tokenExp')); // 로컬스토리지에 저장한 토큰의 생성시간
    //const tokenIat = parseInt(localStorage.getItem('tokenIat'));
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 계산
    const initialTokenTime  = tokenExp ? (tokenExp - currentTime) : 0; // 토큰 유효시간 초기화
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 유무 초기값은 false
    const [tokenTime, setTokenTime] = useState(initialTokenTime ); // 토큰 유효시간에서 1초씩 차감하기 위해 유효시간으로 초기화
    const [logoutTime, setLogoutTime] = useState(3600); // 로그아웃 시간 1시간 초기화 


// 토큰 검증 함수
const verifyToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const verifyResponse = await axios.get(`${process.env.REACT_APP_HOST}/api/verify-token`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true
        });
        return verifyResponse.status === 200;
    } catch (error) {
        console.error("토큰 검증 실패:", error);
        return false;
    }
};
// 토큰 갱신 함수
const refreshToken = async () => {
    try {
        const refreshResponse = await axios.get(`${process.env.REACT_APP_HOST}/api/refresh-token`, { withCredentials: true });
        if (refreshResponse.status === 200) {
            const newToken = refreshResponse.data.newToken;
            const newTokenExp = refreshResponse.data.tokenExp; // 서버가 반환한 남은 유효 시간

            console.log("newTokenExp (remaining time):", newTokenExp);

            localStorage.setItem('accessToken', newToken);
            localStorage.setItem('tokenExp', newTokenExp);

            // 서버가 반환한 남은 유효 시간을 바로 사용
            setTokenTime(newTokenExp); // 타이머 초기화
            //console.log("토큰 갱신 성공", newTokenExp);
            return newTokenExp;
        } else {
            console.error("토큰 갱신 실패: 예상치 못한 상태 코드", refreshResponse.status);
            return 0;
        }
    } catch (error) {
        console.error("토큰 갱신 실패:", error);
        return 0;
    }
};

// 토큰 만료 1분전 확인하는 함수
const checkTokenExpiration = async () => {
    if (tokenTime === 60) { // 로그인 후 화면이 처음 렌더링하면 실행되지 않게 조건추가
        const isTokenValid = await verifyToken();
        if (isTokenValid) {
            const newTokenTime = await refreshToken();
            if (newTokenTime === 0) {
                alert("토큰 갱신 실패");
                handleLogout();
            }
        } else {
            alert("토큰 검증 실패");
            handleLogout();
        }
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
        /*  토큰 만료 1분전 갱신 여부 체크하기
            1. 활동시간이 0이 아니면 토큰 갱신
            2. 활동시간이 0인데 토큰시간이 남았다면 갱신하지 않기
            3. 토큰시간이 0이면 활동시간이 남았더라고 로그아웃
        */
        if (tokenTime === 60) {
            if( logoutTime > 0 )
            checkTokenExpiration();
        }
        if(tokenTime === 0 && logoutTime === 0){
            handleLogout();
        }
        
    }, [tokenTime,logoutTime]);

    useEffect(() => {
        const storedLoggedIn = localStorage.getItem('loggedIn');
        if (storedLoggedIn) {
            setLoggedIn(true);
            setLogoutTime(120); // 유저의 활동 타이머 초기화
            checkTokenExpiration();
        }
        const resetLogoutTime = () => setLogoutTime(3600);

        window.addEventListener("mousemove", resetLogoutTime);
        window.addEventListener("keypress", resetLogoutTime);

        return () => {
            window.removeEventListener("mousemove", resetLogoutTime);
            window.removeEventListener("keypress", resetLogoutTime);
            setLogoutTime(0);
        };
    }, [setLoggedIn]);

    return (
        <>
            {/*<span style={{fontSize:'14px', fontWeight:'bold'}}>로그아웃시간: {formatTime(logoutTime)}</span><br/>*/}
            <span style={{fontSize:'14px', fontWeight:'bold'}}>{formatTime(tokenTime)}</span> {/*토큰만료시간 타이머*/}
        </>
    );
};

export default AuthTimer;