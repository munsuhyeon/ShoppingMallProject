import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cartitem from './Cartitem';
import './Cart.css';


export default function Cart() {
  const navigate = useNavigate();

  // 처음 로드될 때 로컬 스토리지에서 장바구니 데이터를 불러옵니다
  const getInitialCartItems = () => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  };

  const [cartItems, setCartItems] = useState(getInitialCartItems);

  useEffect(() => {
    // cartItems가 변경될 때마다 로컬 스토리지에 저장합니다
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleDelete = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleDeleteAll = () => {
    setCartItems([]);
  };

  const handleOrder = () => {
    navigate('/payment', { state: { cartItems } });
  };

  // 새로운 updateQuantity 함수 추가
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };



  return (
    <div className="shopping-basket">
      <div className="body-header">
        <h2>장바구니</h2>
        <div className="page">
          <p className="page-1">
            장바구니<span>{'>'}</span>
          </p>
          <p className="page-2">
            결제화면<span>{'>'}</span>
          </p>
          <p className="page-3">주문완료</p>
        </div>
      </div>
      <table className="shopping-basket-table">
        <thead>
          <tr className="basket-no-change">
            <th>상품명(옵션)</th>
            <th>판매가</th>
            <th>회원할인</th>
            <th>수량</th>
            <th>주문금액</th>
            <th>주문관리</th>
            <th>배송비</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <Cartitem key={item.id} item={item} onDelete={handleDelete} updateQuantity={updateQuantity} />
          ))}
        </tbody>
      </table>
      <div className="all-delete">
        <button onClick={handleDeleteAll}>전체삭제</button>
      </div>
      <div className="payment-button">
        <button onClick={handleOrder}>주문하기</button>
      </div>
    </div>
  );
}
