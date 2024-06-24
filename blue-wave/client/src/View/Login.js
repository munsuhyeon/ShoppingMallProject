import {useForm} from 'react-hook-form';
import Input from '../UI/Input';
import Button from '../UI/Button';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Header
 from './Header';
const Login = () => {
    const navigate = useNavigate();
    const {register,
        handleSubmit,
        formState : {errors, isValid, isSubmitting},
        setError,
        reset
        } = useForm({mode:'onSubmit'});
    const onSubmit = async (data) => {
        try{
            const response = await axios.post('http://localhost:8000/api/login', { ...data }, { withCredentials: true })
            if(response.data.success){
                // Axios 인스턴스로 만든 모든 미래의 요청에 해당 헤더가 포함됩니다. 
                const accessToken = response.headers['authorization'];
                const decodedExp = response.data.tokenExp;
                const userId = response.data.userId;

                axios.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;

                localStorage.setItem("tokenExp", decodedExp); // 로컬스토리지에 access토큰 만료시간 저장 
                localStorage.setItem("accessToken", accessToken); // 토큰 저장
                localStorage.setItem("userId", userId); // 로그인한 회원 아이디 저장
                localStorage.setItem("loggedIn", true); // 로그인 유무 true로 저장

                navigate('/');
                window.location.reload();
            }else{
                setError("userId", {type: "manual", message: "존재하지 않는 아이디입니다"});
                setError("userPassword", {type: "manual", message: "비밀번호가 틀립니다"});
            }
            console.log(response.data)
        } catch(error){
            if(error.response){
                console.error(
                    "서버 응답 오류 ::: ",
                    error.response.status,
                    error.response.data
                );
                if (error.response.data.message.includes("all wrong")){
                    setError("userId", {type: "manual", message: "틀린 아이디입니다"});
                } else if(error.response.data.message.includes("wrong password")){
                    setError("userPassword", {type: "manual", message: "비밀번호가 틀립니다"});
                }
                
            }else if(error.request){
                console.error("서버 응답이 없음 :::  ", error.request);
                alert("서버 응답이 없습니다");
            }else{
                console.error("요청 설정 중 오류 :::  ", error.message)
                alert("요청 설정 중 오류가 발생했습니다");
            }
            reset();
        }
    };
    const userId = register('userId',{
        required : "필수 입력값입니다",
    });
    const userPassword = register('userPassword',{
        required : "필수 입력값입니다",
    });
    
    return(
        <div className="Login">
            <Header />
            <div style={{margin: '0 auto', padding: '58px 0 160px',width: '600px'}}>
                <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px'}}>
                    <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                </h1>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Input type={'text'} id={'userId'} prop={userId} errors={errors} title={"아이디"} />
                    <Input type={'password'} id={'userPassword'} prop={userPassword} errors={errors} title={"비밀번호"}/>
                    <div className="btn_area" style={{display:'block'}}>
                        <Button text={"로그인"} className={'join_btn'} type='submit'/>
                        <Button text={"카카오 로그인"} className={'sns_btn kakao'} img={<img src={process.env.PUBLIC_URL + `assets/snsLogin/kakao-svgrepo-com.svg`} className="logo_social" type='button'/>}/>
                        <Button text={"네이버 로그인"} className={'sns_btn naver'} img={<img src={process.env.PUBLIC_URL + `assets/snsLogin/naver-svgrepo-com_wh.svg`} className="logo_social" />}/>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login;