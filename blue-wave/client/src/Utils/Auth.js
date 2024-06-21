import axios from "axios";

const verifyToken = async () => {
    console.log("verifyToken")
    try {
        const token = axios.defaults.headers.common['authorization'];
        if(!token){
            // 클라이언트에서 토큰이 없는 경우 처리 (예: 로그인 페이지로 리다이렉트)
            alert("토큰이 없습니다")
            throw new Error("토큰이 없습니다");
        }
        // 서버에 토큰 유효성 검사 요청
        const response = await axios.get('http://localhost:8000/api/verify-token');
        if(response.status === 200){
            alert("토큰이 유효합니다");
            console.log(response.data);
            // 서버에서 유효성 검사 통과 후, 필요 시 accessToken을 재발급 받는 로직
            const newAccessTokenResponse = await axios.post('http://localhost:8000/api/refresh-token');
            if(newAccessTokenResponse.status === 200){
                // 새로운 accessToken을 받아오고, 클라이언트의 axios 헤더에 설정
                const accessToken = newAccessTokenResponse.data.newAccessToken;
                axios.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;
                alert("토큰 재발급 성공")
                alert(accessToken)
            }else{
                // refreshToken이 만료된 경우 또는 유효하지 않은 경우 처리
                alert("토큰 재발급 실패")
                throw new Error("토큰 재발급 실패");
            }
        }else{
             // 서버에서 토큰 유효성 검사 실패 시 처리 (예: 로그인 페이지로 리다이렉트)
             alert("토큰 유효성 검사 실패")
            throw new Error("토큰 유효성 검사 실패");
        }
        
    } catch (error) {
        console.error("토큰 검증 오류:", error);
        window.location.href = "/login"; // 오류 발생 시 로그인 페이지로 이동
    }
  };
  export default verifyToken; 