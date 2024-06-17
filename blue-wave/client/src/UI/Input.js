import React from 'react';
import './Input.css';

const Input = ({type, id, placeholder, prop, errors, title}) => {
    return(
        <div className='input_box'>
            <label htmlFor={id}>{title}</label>
            <div className='inputItem'>
                <input type={type} id={id} placeholder={placeholder} {...prop} className={errors[id] ? 'input-error' : 'input_txt'}/>
            </div>
            {errors && errors[id] && <p className='errorTxt'>{errors[id].message}</p>}
        </div>
    )
}
export default Input;