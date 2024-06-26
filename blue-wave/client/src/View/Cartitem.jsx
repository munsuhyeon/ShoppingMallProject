import React from "react";
import PayButton from "../UI/PayButton";

const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

const CartItem = ({ item, onDelete, updateQuantity }) => {
  const onIncrease = () => {
    const newQuantity = item.quantity + 1;
    updateQuantity(item.id, item.option, newQuantity); // updateQuantity 함수 호출
  };

  const onDecrease = () => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateQuantity(item.id, item.option, newQuantity); // updateQuantity 함수 호출
    }
  };

  const price = parseInt(item.price);
  const orderTotal = item.quantity * price;

  return (
    <tr className="basket-change">
      <td className="img-option-flex">
        <img src={item.image} alt="" />
        <div className="option">
          <p>{item.p_name}</p>
          <p>{item.option}</p>
        </div>
      </td>
      <td>{formatPrice(item.price)}원</td>
      <td>0</td>
      <td>
        <PayButton className="plus-button" onClick={onIncrease}>
          +
        </PayButton>
        {item.quantity}
        <PayButton className="plus-button" onClick={onDecrease}>
          -
        </PayButton>
      </td>
      <td>{formatPrice(orderTotal)}원</td>
      <td>
        <PayButton
          className="Delete-button"
          onClick={() => onDelete(item.id, item.option)}
        >
          삭제하기
        </PayButton>
      </td>
      <td>배송비 무료</td>
    </tr>
  );
};

export default CartItem;
