import {useForm} from 'react-hook-form';
import Input from '../UI/Input';
import Button from '../UI/Button';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
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
                //axios.defaults.headers.common을 사용하여 헤더를 설정하면, 
                //API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정된다
                //이는 요청마다 헤더를 반복해서 설정할 필요가 없어져 코드가 간단해지고 일관성이 유지됩니다.
                const accessToken = response.headers['authorization']; 
                axios.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;
                console.log("Authorization header set:   ", axios.defaults.headers.common['authorization']); // 헤더 로그 출력
                localStorage.setItem("loggedIn", true);
                const expirationTime = Date.now() + 3600 * 1000; //api요청 헤더에 저장한 토큰의 만료시간
                localStorage.setItem("accessTokenExpiration", expirationTime);
                navigate('/');
            } else {
                setError("userId", {type: "manual", message: "존재하지 않는 아이디입니다"});
                setError("userPassword", {type: "manual", message: "비밀번호가 틀립니다"});
            }
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
            <div style={{margin: '0 auto', padding: '58px 0 160px',width: '600px'}}>
                <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px'}}>
                    <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                </h1>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Input type={'text'} id={'userId'} prop={userId} errors={errors} title={"아이디"} />
                    <Input type={'password'} id={'userPassword'} prop={userPassword} errors={errors} title={"비밀번호"}/>
                    <div className="btn_area">
                        <Button text={"로그인"} className={'wide_btn'} type='submit'/>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login;