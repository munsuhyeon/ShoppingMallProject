import Header from "./Header";
import Input from "../UI/Input";
import Button from "../UI/Button";
import {useForm} from 'react-hook-form';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {

    const navigate = useNavigate();

    const {register,
        handleSubmit,
        formState : {errors},
        setError
    } = useForm({mode:'onSubmit'});

    const onSubmit = async(data) => {
        try{
            const userId = data.userId;
            const userEmail = data.userEmail;
            const response = await axios.get(`http://localhost:8000/api/finwPassword?userId=${userId}&userEmail=${userEmail}`);
            if(response.data.success === false){
                setError('userEmail',{message: response.data.message})
            }else{
                console.log(response.data.result)
                navigate('/resetPassword', {state:response.data.result}) 
            }

        } catch(error){
            alert("서버와의 응답 중 오류가 발생하였습니다")
            console.log(error)
        }
    }
    const userId = register('userId',{
        required : "필수 입력값입니다",
    });
    const userEmail = register('userEmail',{
        required : "필수 입력값입니다",
        pattern : {
            value : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
            message : "유효하지 않은 이메일 형식입니다"
        }
    });
    return(
        <div>
            <Header/>
            <div className="FindPassword" style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center',height:'80vh'}}>
                <div style={{margin: '0 auto',width: '600px'}}>
                    <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px',textAlignLast:'center'}}>
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                    </h1>
                    <h2 style={{fontSize: '32px',letterSpacing: '-.48px',paddingBottom: '46px',textAlign: 'center',marginTop: '20px'}}>비밀번호 찾기</h2>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Input type={'email'} id={'userEmail'} prop={userEmail} errors={errors} title={"이메일"}/>
                        <Input type={'text'} id={'userId'} prop={userId} errors={errors} title={"아이디"} />
                        <div className="btn_area" style={{display:'block'}}>
                            <Button text={"비밀번호 찾기"} className={'join_btn'} type='submit'/>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
};
export default FindPassword