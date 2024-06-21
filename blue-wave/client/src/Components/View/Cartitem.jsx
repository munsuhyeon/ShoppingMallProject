import { useState } from "react";
import Button from '../UI/Button'


export default function Cartitem({item, onDelete, updateQuantity}) {
    const [quantity, setQuantity] = useState(item.quantity)
    

    function onIncrease()  {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      updateQuantity(item.id, newQuantity);
      }
      
      function onDecrease()  {
        if(quantity > 1){
          const newQuantity = quantity - 1
          setQuantity(newQuantity)
          updateQuantity(item.id, newQuantity);
        }
    }
    // 상품명 옵션 가격 수량 주문금액 

     const orderTotal = quantity * item.price

    return (
    <tr className="basket-change">
      <td className="img-option-flex">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQisS2JAdJHBnxB9YblQPyWAMESVA4qDcxnng&s"
          alt=""
        />
        <div className="option">
          <p>{item.name}</p>
          <p>{item.option}</p>
        </div>
      </td>
      <td>{item.price}</td>
      <td>0</td>
      <td>
        <Button className="plus-button" onClick={onIncrease}>+</Button>{quantity}
        <Button className="plus-button" onClick={onDecrease}>-</Button>
      </td>
      <td>{orderTotal}</td>
      <td>
      <Button onClick={() => onDelete(item.id)}>삭제하기</Button>
      </td>
      <td>배송비 무료</td>
    </tr>
  );
}
