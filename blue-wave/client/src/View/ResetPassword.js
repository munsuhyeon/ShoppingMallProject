import { useNavigate, useLocation} from 'react-router-dom';
import Header from "./Header";
import Input from "../UI/Input";
import Button from "../UI/Button";
import {useForm} from 'react-hook-form';
import axios from "axios";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state; // 전달받은 유저의 아이디와 이메일 정보
    const userId = data.userId;
    const userEmail = data.userEmail;
    const {register,
        handleSubmit,
        formState : {errors, isValid, isSubmitting},
        watch,
        setValue,
        reset
        } = useForm({mode:'onBlur'});

    const userPassword = register('userPassword',{
        required : "필수 입력값입니다",
        minLength : {
            value: 8,
            message : "최소 8글자 이상 입력해주세요"
        },
        maxLength : {
            value : 16,
            message : "최대 16글자만 입력가능합니다"
        },
        pattern : {
            value : /^(?=(?:.*[a-z])(?:.*[A-Z])|(?:.*[a-z])(?:.*[0-9])|(?:.*[A-Z])(?:.*[0-9]))[a-zA-Z0-9]+$/,
            message : "영문 소문자, 영문 대문자, 숫자 중 2가지 이상 조합해주세요"
        }
    });
    const comparePassword = register('comparePassword',{
        required : "필수 입력값입니다",
        validate : (value) => value === watch('userPassword') || "입력하신 비밀번호와 일치하지 않습니다"

    });
    const onSubmit = async (data) => {
        const payload = {
            ...data,
            userId: userId
        };
        await axios.post(`${process.env.REACT_APP_HOST}/api/resetPassword`,payload)
        .then((response) => {
            alert("비밀번호가 변경되었습니다")
            navigate('/complete_changePw')
        })
        .catch((error) => {
            console.error("요청 설정 중 오류 :::  ", error.message)
        })
    }

    return(
        <div>
            <Header/>
            <div className="FindPassword" style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center',height:'80vh'}}>
                <div style={{margin: '0 auto',width: '600px'}}>
                    <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px',textAlignLast:'center'}}>
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                    </h1>
                    <h2 style={{fontSize: '32px',letterSpacing: '-.48px',paddingBottom: '46px',textAlign: 'center',marginTop: '20px'}}>비밀번호 재설정</h2>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Input type={'password'} id={'userPassword'} prop={userPassword} errors={errors} title={"비밀번호"} placeholder={'영문 소문자, 영문 대문자, 숫자 중 2가지 이상 조합  8-16자'} />
                        <Input type={'password'} id={'comparePassword'} prop={comparePassword} errors={errors} title={"비밀번호 확인"} placeholder={'비밀번호를 한번 더 입력해주세요'} />
                        <div className="btn_area" style={{display:'block'}}>
                            <Button text={"비밀번호 재설정"} className={'join_btn'} type='submit'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default ResetPassword