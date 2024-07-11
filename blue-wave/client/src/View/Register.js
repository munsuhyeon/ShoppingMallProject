import {useForm} from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Terms from "../Components/Register/Terms";
import Modal from 'react-modal';
import DaumPostcode from 'react-daum-postcode';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Header from './Header';

const Register = () => {
    const location = useLocation();
    const [userType, setUserType] = useState('B');
    const [getEmail, setGetEmail] = useState('');
    useEffect(() => {
        if (location.state) {
            setUserType(location.state.userType || 'B');
            setGetEmail(location.state.userEmail || '');
        }
    },[location.state])
    
    const navigate = useNavigate();
    const {register,
        handleSubmit,
        formState : {errors, isValid, isSubmitting},
        watch,
        setValue,
        reset
        } = useForm({mode:'onBlur'});
    useEffect(() => {
        if (getEmail) {
            reset({ userEmail: getEmail, userType: userType });
        }
    }, [getEmail, reset]);
    // 가입하기 버튼 클릭
    const onSubmit = async (data) => {
        await axios.post(`${process.env.REACT_APP_HOST}/api/register`,{
            ...data
        })
        .then((response) => {
            //console.log("서버 응답 :::   ", response.data);
            if(response.data.success){
                alert(response.data.message || "회원가입이 완료되었습니다");
                navigate('/complete_register');
            } else {
                alert(response.data.message || "회원가입이 실패하였습니다");
            }
            reset(); // 폼에 입력한 글자 전부 지우기
        })
        .catch((error) => {
            if(error.response){
                console.error(
                    "서버 응답 오류 ::: ",
                    error.response.status,
                    error.response.data
                );
                alert(error.response.data.message || "서버 응답 중 오류가 발생하였습니다")
            }else if(error.request){
                console.error("서버 응답이 없음 :::  ", error.request);
                alert("서버 응답이 없습니다");
            }else{
                console.error("요청 설정 중 오류 :::  ", error.message)
                alert("요청 설정 중 오류가 발생했습니다");
            }
            reset();
        });
    };
    

    const userId = register('userId',{
        required : "필수 입력값입니다",
        minLength : {
            value: 4,
            message : "최소 4글자 이상 입력해주세요"
        },
        maxLength : {
            value : 16,
            message : "최대 16글자만 입력가능합니다"
        },
        pattern : {
            value : /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/,
            message : "영문 소문자와 숫자를 조합해주세요"
        }
    });
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
    const userName = register('userName',{
        required : "필수 입력값입니다",
        minLength : {
            value : 2,
            message : "이름은 최소 2글자 이상이어야 합니다"
        },
        maxLength : {
            value: 5,
            message : "이름은 최대 5글자입니다"
        }
    });
    const userPhone = register('userPhone',{
        required : "필수 입력값입니다",
        minLength : {
            value : 9,
            message : "잘못된 번호입니다. 다시 입력해 주십시오."
        },
        maxLength : {
            value: 12,
            message : "잘못된 번호입니다. 다시 입력해 주십시오."
        },
        validate: (value) => {
            // 정규 표현식으로 추가적인 패턴 검사
            const mobilePattern = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;
            const telPattern = /^(070|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
            
            if (!mobilePattern.test(value) && !telPattern.test(value)) {
                return "잘못된 번호입니다. 다시 입력해 주십시오.";
            }
            return true;
        }
    });
    const userEmail = register('userEmail',{
        required : "필수 입력값입니다",
        pattern : {
            value : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
            message : "유효하지 않은 이메일 형식입니다"
        }
    });
    const addrDetailRef = useRef();
    const { detailAddress, address, zonecode } = watch(); // watch 함수를 통해 detailAddress 필드의 값을 감시
    const [allChecked, setAllChecked] = useState(false);  // 체크박스 상태 관리

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (e) => {
        e.preventDefault(); // 폼 제출방지
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const onComplete = (data) => {
        let addr;
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
        }
        setValue('address',addr)
        setValue('zonecode',data.zonecode)
        setIsModalOpen(false);

        if(addrDetailRef.current){
            setTimeout(() => {addrDetailRef.current.focus()},100)
        }
    }
    return(
        <div>
            <Header />
            <div className='Register' style={{margin: '0 auto', maxWidth: '1280px'}}>
                <div style={{margin: '0 auto', padding: '58px 0 160px',width: '600px'}}>
                    <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px'}}>
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                    </h1>
                    <h2 style={{fontSize: '32px',letterSpacing: '-.48px',paddingBottom: '46px',textAlign: 'center',marginTop: '20px'}}>회원가입</h2>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>

                            <Input type={'text'} id={'userId'} prop={userId} errors={errors} title={"아이디"} placeholder={'영문 소문자,숫자 4-16글자'} />
                            <Input type={'password'} id={'userPassword'} prop={userPassword} errors={errors} title={"비밀번호"} placeholder={'영문 소문자, 영문 대문자, 숫자 중 2가지 이상 조합  8-16자'} />
                            <Input type={'password'} id={'comparePassword'} prop={comparePassword} errors={errors} title={"비밀번호 확인"} placeholder={'비밀번호를 한번 더 입력해주세요'} />
                            <Input type={'text'} id={'userName'} prop={userName} errors={errors} title={"이름"}/>
                            <Input type={'tel'} id={'userPhone'} prop={userPhone} errors={errors} title={"휴대폰"} placeholder={'숫자만 입력해주세요'} />
                            {userType == 'B' ? (<Input type={'email'} id={'userEmail'} prop={userEmail} errors={errors} title={"이메일"}/>) 
                            : (<Input type={'email'} id={'userEmail'} prop={userEmail} errors={errors} title={"이메일"} readOnly={true}/>)}
                            
                            <input type='hidden' name='userType' id='userType' value={userType} {...register('userType')} />
                            <div className="input_box">
                                <label style={{fontSize: '13px', lineHeight: '18px',letterSpacing: '-.07px',fontWeight: '900'}}>주소</label>
                                <div className="input_item input_address">
                                    <input placeholder='우편번호' id='zonecode' value={zonecode} className='input_txt' {...register('zonecode')} readOnly />
                                    <Button text={"우편번호"} className={'address_btn'} onClick={openModal}/>
                                </div>
                            </div>
                            <Modal isOpen={isModalOpen} ariaHideApp={false} style={{content: { width: '500px',height: '500px', margin: 'auto', overflow: 'hidden'}}}>
                            <div style={{display:"flex", justifyContent: 'space-between'}}>
                                <p style={{width: 'calc(100% - 40px)', textAlign: 'left'}}>주소 검색</p>
                                <img style={{width: '40px', height: '40px', cursor: 'pointer'}} onClick={closeModal} src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close"/>
                            </div>
                                <DaumPostcode onComplete={onComplete}/>
                            </Modal>
                            <div className="input_box">
                                <div className="input_item">
                                    <input placeholder='기본주소' id="address" value={address} className='input_txt' {...register('address')} readOnly />
                                </div>
                            </div>
                            <div className="input_box">
                                <div className="input_item">
                                    <input type='text' placeholder='상세주소' id="detailAddress" className={errors.detailAddress ? 'input-error' : 'input_txt'} ref={addrDetailRef} {...register('detailAddress',{required:'필수 입력값입니다'})}/>
                                </div>
                                {errors.detailAddress && <p className='errorTxt'>{errors.detailAddress.message}</p>}
                            </div>
                            <Terms  setAllChecked={setAllChecked} />
                        <Button text={"가입하기"} className={isValid && allChecked ? 'wide_btn pass_btn' : 'wide_btn fail_btn'} disabled={!isValid || !allChecked || isSubmitting} type='submit'/>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;