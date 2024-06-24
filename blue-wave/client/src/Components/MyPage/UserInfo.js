import React, { useState, useContext, useEffect } from "react";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import DaumPostcode from 'react-daum-postcode';
import axios from "axios";
import { AuthContext } from "../../Utils/AuthContext";

const UserInfo = () => {
    const { userId } = useContext(AuthContext);

    // 비동기 함수로 defaultValues를 설정합니다.
    const defaultValues = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/userInfo`, {
                headers: { user_id: `${userId}` }
            });
            const userData = response.data.data[0];
            return {
                userId: userData.user_id,
                userPassword: '',
                comparePassword: '',
                userName: userData.user_name || '',
                userPhone: userData.user_phone || '',
                userEmail: userData.user_email || '',
                address: userData.address || '',
                detailAddress: userData.detail_address || '',
                zonecode: userData.zonecode || '',
            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return {};
        }
    };

    const { register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({ defaultValues: {} }); // 초기 defaultValues를 빈 객체로 설정합니다.

    useEffect(() => {
        // 비동기 함수를 호출하여 defaultValues를 설정합니다.
        const fetchDefaultValues = async () => {
            const values = await defaultValues();
            // setValue를 사용하여 폼 필드에 값을 설정합니다.
            Object.keys(values).forEach(key => {
                setValue(key, values[key]);
            });
        };

        fetchDefaultValues();
    }, [userId, setValue]);

    const { detailAddress, address, zonecode } = watch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        e.preventDefault(); // 폼 제출 방지
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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

    const onSubmit = (data) => {
        // 제출할 때 실행되는 코드
        console.log(data);
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
                            <Input type={'text'} id={'userId'} {...register('userId')} errors={errors} title={"아이디"} placeholder={'영문 소문자,숫자 4-16글자'} />
                            <Input type={'password'} id={'userPassword'} {...register('userPassword')} errors={errors} title={"비밀번호"} placeholder={'영문 소문자, 영문 대문자, 숫자 중 2가지 이상 조합  8-16자'} />
                            <Input type={'password'} id={'comparePassword'} {...register('comparePassword')} errors={errors} title={"비밀번호 확인"} placeholder={'비밀번호를 한번 더 입력해주세요'} />
                            <Input type={'text'} id={'userName'} {...register('userName')} errors={errors} title={"이름"} />
                            <Input type={'tel'} id={'userPhone'} {...register('userPhone')} errors={errors} title={"휴대폰"} placeholder={'숫자만 입력해주세요'} />
                            <Input type={'email'} id={'userEmail'} {...register('userEmail')} errors={errors} title={"이메일"} />

                            <div className="input_box">
                                <label style={{ fontSize: '13px', lineHeight: '18px', letterSpacing: '-.07px', fontWeight: '900' }}>주소</label>
                                <div className="input_item input_address">
                                    <input placeholder='우편번호' id='zonecode' value={zonecode} className='input_txt' readOnly />
                                    <Button text={"우편번호"} className={'address_btn'} onClick={openModal} />
                                </div>
                            </div>
                            <Modal isOpen={isModalOpen} ariaHideApp={false} style={{ content: { width: '500px', height: '500px', margin: 'auto', overflow: 'hidden' } }}>
                                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                    <p style={{ width: 'calc(100% - 40px)', textAlign: 'left' }}>주소 검색</p>
                                    <img style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={closeModal} src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close" />
                                </div>
                                <DaumPostcode onComplete={onComplete} />
                            </Modal>
                            <div className="input_box">
                                <div className="input_item">
                                    <input placeholder='기본주소' id="address" value={address} className='input_txt' readOnly />
                                </div>
                            </div>
                            <div className="input_box">
                                <div className="input_item">
                                    <input type='text' placeholder='상세주소' id="detailAddress" className={errors.detailAddress ? 'input-error' : 'input_txt'} {...register('detailAddress', { required: '필수 입력값입니다' })} />
                                </div>
                                {errors.detailAddress && <p className='errorTxt'>{errors.detailAddress.message}</p>}
                            </div>
                            <div className="btn_area">
                                <button type="submit" className="profile_btn submit">회원정보수정</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
