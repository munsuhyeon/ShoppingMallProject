// 로그아웃 함수
export const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("tokenExp");
    window.location.href = "/";
    window.location.reload();
  };
  
// 초를 시.간.분 으로 표시하는 함수
export const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}시간 ` : ""}${m}분 ${s}초`;
};  
  