// 로그아웃 함수
export const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("tokenExp");
    localStorage.removeItem("tokenIat");
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
// 년-월-일 으로 표시하는 함수
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};
// 엔터키를 줄바꿈으로 변환하는 함수
export const createMarkup = (text) => {
  return { __html: text.replace(/\n/g, '<br>') };
};
  