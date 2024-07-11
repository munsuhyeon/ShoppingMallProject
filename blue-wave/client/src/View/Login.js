import {useForm} from 'react-hook-form';
import Input from '../UI/Input';
import Button from '../UI/Button';
import axios from "axios";
import {useNavigate,Link } from 'react-router-dom';
import Header from './Header';

const Login = () => {
    const navigate = useNavigate();
    const {register,
        handleSubmit,
        formState : {errors, isValid, isSubmitting},
        setError
        } = useForm({mode:'onSubmit'});

    const onSubmit = async (data) => {
        try{
            const response = await axios.post(`${process.env.REACT_APP_HOST}/api/login`, { ...data }, { withCredentials: true })
            if(response.data.success){
                // Axios 인스턴스로 만든 모든 미래의 요청에 해당 헤더가 포함됩니다. 
                const accessToken = response.headers['authorization'];
                const decodedExp = response.data.tokenExp;
                const userId = response.data.userId;
                const userName = response.data.userName;
                const tokenIat = response.data.tokenIat;

                axios.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;

                localStorage.setItem("tokenExp", decodedExp); // 로컬스토리지에 access토큰 만료시간 저장 
                //localStorage.setItem("tokenIat", tokenIat); // 토큰 생성시간
                localStorage.setItem("accessToken", accessToken); // 토큰 저장
                localStorage.setItem("loggedIn", true); // 로그인 유무 true로 저장
                localStorage.setItem("userId", userId); // 로그인한 회원 아이디 저장
                localStorage.setItem("userName", userName);
                
                
                navigate('/');
                window.location.reload();
             }
            //console.log(response.data)
        } catch(error){
            if(error.response){
                console.error(
                    "서버 응답 오류 ::: ",
                    error.response.status,
                    error.response.data
                );
                if (error.response.data.message.includes("all wrong")){
                    setError("userId", {type: 'manual',message: "틀린 아이디입니다"});
                } else if(error.response.data.message.includes("wrong password")){
                    setError("userPassword", {type: 'manual',message: "비밀번호가 틀립니다"});
                }
                
            }else if(error.request){
                console.error("서버 응답이 없음 :::  ", error.request);
                alert("서버 응답이 없습니다");
            }else{
                console.error("요청 설정 중 오류 :::  ", error.message)
                alert("요청 설정 중 오류가 발생했습니다");
            }
        }
    };
    const userId = register('userId',{
        required : "필수 입력값입니다",
    });
    const userPassword = register('userPassword',{
        required : "필수 입력값입니다",
    });
    const kakaoLogin = (e) => {
        e.preventDefault();
        const clientId = process.env.REACT_APP_Kakao_clientId
        const redirectUri = process.env.REACT_APP_Kakao_redirectUri
        const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
        window.location.href = kakaoUrl;
    }
    return(
        <div>
            <Header />
            <div className="Login" style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center',height:'80vh'}}>
                <div style={{margin: '0 auto',width: '600px'}}>
                    <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px',textAlignLast:'center'}}>
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                    </h1>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Input type={'text'} id={'userId'} prop={userId} errors={errors} title={"아이디"} />
                        <Input type={'password'} id={'userPassword'} prop={userPassword} errors={errors} title={"비밀번호"}/>
                        <div style={{display:'flex', justifyContent:'space-around',marginBottom:'20px',fontSize:'13px',fontWeight:'500'}}>
                            <Link to='/findId'><p>아이디 찾기</p></Link>
                            <p>|</p>
                            <Link to='/findPassword'><p>비밀번호 찾기</p></Link>
                        </div>
                        <div className="btn_area" style={{display:'block'}}>
                            <Button text={"로그인"} className={'join_btn'} type='submit'/>
                            <Button text={"카카오 로그인"} className={'sns_btn kakao'} onClick={kakaoLogin} img={<img src={process.env.PUBLIC_URL + `assets/snsLogin/kakao-svgrepo-com.svg`} className="logo_social" type='button'/>}/>
                       
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login;