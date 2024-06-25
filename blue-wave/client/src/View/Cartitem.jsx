import React, { useState } from 'react';
import PayButton from '../UI/PayButton';

const Cartitem = ({ index ,item, onDelete, updateQuantity }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const onIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(item.id, item.option,newQuantity);
  };

  const onDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item.id, item.option,newQuantity);
    }
  };

  // 상품 가격을 숫자로 변환하여 계산
  const price = parseInt(item.price);
  const orderTotal = quantity * price;

  return (
    <tr className="basket-change">
      <td className="img-option-flex">
        <img
          src={item.image}
          alt=""
        />
        <div className="option">
          <p>{item.p_name}</p>
          <p>{item.option}</p>
        </div>
      </td>
      <td>{item.price}</td>
      <td>0</td>
      <td>
        <PayButton className="plus-button" onClick={onIncrease}>
          +
        </PayButton>
        {quantity}
        <PayButton className="plus-button" onClick={onDecrease}>
          -
        </PayButton>
      </td>
      <td>{orderTotal}</td>
      <td>
        <PayButton onClick={() => onDelete(index)}>삭제하기</PayButton>
      </td>
      <td>배송비 무료</td>
    </tr>
  );
};

export default Cartitem;
