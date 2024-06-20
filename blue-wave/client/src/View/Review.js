import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Text = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: '',
        product_id: '',
        order_id: '',
        title: '',
        contents: '',
        star_rating: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (data) => {
        try{
            const response = await axios.post('http://localhost:8000/text', formData);
            if(response.data.success){
                alert(response.data.message);
                navigate('/');
            } else{
                alert(response.data.message);
            }
        } catch(error){
            // 서버가 응답한 상태 코드가 200이 아닌 경우
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
        }
    };

    return (
        <div>
            <input
                type="text"
                name="user_id"
                placeholder="사용자 ID"
                value={formData.user_id}
                onChange={handleChange}
            />
            <input
                type="text"
                name="product_id"
                placeholder="제품 ID"
                value={formData.product_id}
                onChange={handleChange}
            />
            <input
                type="text"
                name="order_id"
                placeholder="주문 ID"
                value={formData.order_id}
                onChange={handleChange}
            />
            <input
                type="text"
                name="title"
                placeholder="제목"
                value={formData.title}
                onChange={handleChange}
            />
            <input
                type="text"
                name="contents"
                placeholder="리뷰 내용"
                value={formData.contents}
                onChange={handleChange}
            />
            <input
                type="text"
                name="star_rating"
                placeholder="별점"
                value={formData.star_rating}
                onChange={handleChange}
            />
           
            <button onClick={handleSubmit}>전송</button>
        </div>
    );
};

export default Text;
