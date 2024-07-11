import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {ThreeDots} from "react-loader-spinner"
const KakaoLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    console.log("code   ::   " + code);

    axios.post("https://kauth.kakao.com/oauth/token", null, {
      headers : {"Content-Type": "application/x-www-form-urlencoded"},
      params : {
        grant_type : "authorization_code",
        client_id : `${process.env.REACT_APP_Kakao_clientId}`,
        redirect_uri : `${process.env.REACT_APP_Kakao_redirectUri}`,
        code : code
      }
    })
    .then((res) => {
      console.log(res)
      axios.post(`${process.env.REACT_APP_HOST}/api/getKakaoUser`, null, {
        headers:{"data" : JSON.stringify(res.data)}
      })
      .then((res) => {
        console.log("토큰전달 성공  ::   ", res)
        // 카카오 로그인으로 가입할려는 회원
        if(res.data.message == "no user"){
          console.log(res.data)
          alert("회원가입 정보가 없어 회원가입화면으로 넘어갑니다")
          navigate('/register',{state : {userEmail:res.data.userEmail, userType:'K'}})
        } else if(res.data.message == "active user"){
          // 로그인 진행시키기
          const accessToken = res.data.accessToken;
          axios.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;
          localStorage.setItem("loggedIn", true); // 로그인 유무 true로 저장
          localStorage.setItem("userId", res.data.userInfo.user_id); // 로그인한 회원 아이디 저장
          localStorage.setItem("userName", res.data.userInfo.user_name);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("tokenExp", res.data.tokenExp);
          navigate('/');
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("토큰전달 에러  ::   ", err)
        alert("로그인 시도 중 오류가 발생하였습니다")
        navigate('/login');
      })
    })
    .catch((err) => {
      console.log(err)
      alert("로그인 시도 중 오류가 발생하였습니다")
      navigate('/login');
    })
  }, [location]);

  return (
    <div className="spinnerWrapper" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column'}}>
      <ThreeDots
      visible={true}
      height="110"
      width="110"
      color="#2764e6"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""/>
      <h1>페이지를 로딩중입니다</h1>
    </div>
  );
};

export default KakaoLogin;
