import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./review.css"
import OrderSheet from './OrderSheet';

const Text = ({userId,orderId,productId,pname,mainimage,isClose}) => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        p_name: pname,
        user_id: userId,
        product_id:productId ,
        order_id: orderId,
        title: '',
        contents: '',
        star_rating: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(`${process.env.REACT_APP_HOST}/text`, formData);
            if(response.data.success){
                alert(response.data.message);
                isClose()
                window.location.reload();
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
                alert("서버 응답 중 오류가 발생하였습니다")
            }
        }
    };
    

 

    return (
        
        <div>
            <div className='div1'>
                <img src={mainimage} style={{width:'90px'}}></img>
            <p className='product_id'>{pname}</p>
            </div>
            
       
                      <form className="mb-3" name="myform" id="myform" onChange={handleChange}>
      <fieldset>
        <input type="radio" name="star_rating" value="5" id="rate5"  onChange={handleChange}/>
        <label htmlFor="rate5">★</label>

        <input type="radio" name="star_rating" value="4" id="rate4" onChange={handleChange} />
        <label htmlFor="rate4">★</label>

        <input type="radio" name="star_rating" value="3" id="rate3" onChange={handleChange} />
        <label htmlFor="rate3">★</label>

        <input type="radio" name="star_rating" value="2" id="rate2"  onChange={handleChange}/>
        <label htmlFor="rate2">★</label>

        <input type="radio" name="star_rating" value="1" id="rate1" onChange={handleChange} />
        <label  htmlFor="rate1">★</label>
      </fieldset>
    </form>
            <input
            className='reviewContents_1'
                type="text"
                name="title"
                placeholder="제목"
                value={formData.title}
                onChange={handleChange}
            />
            <textarea
              className='reviewContents'
                type="text"
                name="contents"
                placeholder="리뷰 내용"
                value={formData.contents}
                onChange={handleChange}
            />
           
           
            <button className="ReviewButton" onClick={handleSubmit}>전송</button>
        </div>
    );
};


export default Text;
