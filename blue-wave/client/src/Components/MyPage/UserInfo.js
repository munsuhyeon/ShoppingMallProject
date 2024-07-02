import React, { useState, useContext, useEffect } from "react";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import DaumPostcode from 'react-daum-postcode';
import axios from "axios";
import { AuthContext } from "../../Utils/AuthContext";

const UserInfo = () => {
    //const { userId } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        userId: '',
        userPassword: '',
        comparePassword: '',
        userName: '',
        userPhone: '',
        userEmail: '',
        address: '',
        detailAddress: '',
        zonecode: ''
    });
    
    const { register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        setError,
        reset
    } = useForm({mode:'onBlur'}); 

    const userId = localStorage.getItem('userId')

    // 비동기 함수로 defaultValues를 설정합니다.
    const fetchDefaultValues = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST}/api/userInfo?user_id=` + userId);
            const userData = response.data.data[0];
            const defaultValues = {
                userId: userData.user_id,
                userPassword: '',
                comparePassword: '',
                userName: userData.user_name,
                userPhone: userData.user_phone,
                userEmail: userData.user_email,
                address: userData.address,
                detailAddress: userData.address_detail,
                zonecode: userData.zone_code
            };
            setUserData(defaultValues); // setState를 사용하여 상태에 값을 설정합니다.
            reset(defaultValues); // reset을 사용하여 폼 필드에 값을 설정합니다.
        } catch (error) {
            console.error('회원정보 데이터 불러오기 에러:', error);
        }
    };

    useEffect(() => {
        fetchDefaultValues();
    }, [userId]);

    const { detailAddress, address, zonecode } = watch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        e.preventDefault(); // 폼 제출 방지
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
    const userPassword = register('userPassword',{
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
        validate : (value) => value === watch('userPassword') || "입력하신 비밀번호와 일치하지 않습니다"
    });

    const onComplete = (data) => {
        let addr;
        if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
        } else {
            addr = data.jibunAddress;
        }
        setValue('address', addr);
        setValue('zonecode', data.zonecode);
        setIsModalOpen(false);
    };

    const onSubmit = async (data) => {
        // 제출할 때 실행되는 코드
        await axios.post(`${process.env.REACT_APP_HOST}/api/updateUser`,{
            ...data
        })
        .then((response) => {
            //console.log("서버 응답 :::   ", response.data);
            if(response.data.message === "duplicate email"){
                setError("userEmail", {message: "중복된 이메일입니다"});
            } else if(response.status === 200){
                alert(response.data.message);
                window.location.reload();
            }
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

    return (
        <div className="userInfo">
            <div className="edit_wrraper">
                <div className="edit_area">
                    <h2 className="edit_profile">개인 정보 수정</h2>
                </div>
            </div>

            <div className="form_wrapper">
                <div className="form_area">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="edit_pw_area">
                        <Input type={'text'} id={'userId'} prop={register('userId')} errors={errors} title={"아이디"} placeholder={'영문 소문자,숫자 4-16글자'} readOnly={true}/>
                            <Input type={'password'} id={'userPassword'} prop={userPassword} errors={errors} title={"비밀번호"} placeholder={'영문 소문자, 영문 대문자, 숫자 중 2가지 이상 조합  8-16자'} />
                            <Input type={'password'} id={'comparePassword'} prop={comparePassword} errors={errors} title={"비밀번호 확인"} placeholder={'비밀번호를 한번 더 입력해주세요'} />
                            <Input type={'text'} id={'userName'} prop={register('userName')} errors={errors} title={"이름"} readOnly={true}/>
                            <Input type={'tel'} id={'userPhone'} prop={userPhone} errors={errors} title={"휴대폰"} placeholder={'숫자만 입력해주세요'} />
                            <Input type={'email'} id={'userEmail'} prop={userEmail} errors={errors} title={"이메일"}/>
                        
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
                                    <input type='text' placeholder='상세주소' id="detailAddress" className={errors.detailAddress ? 'input-error' : 'input_txt'} {...register('detailAddress', { required: '필수 입력값입니다' })} />
                                </div>
                                {errors.detailAddress && <p className='errorTxt'>{errors.detailAddress.message}</p>}
                            </div>
                            <div className="btn_area">
                                <Button text={"회원정보수정"} className={"wide_btn"} type='submit'/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
