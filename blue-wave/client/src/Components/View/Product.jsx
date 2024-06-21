import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product() {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // 상품 정보
    const newItem = {
      id: Math.random().toString(36).substr(2, 9), // 임의의 ID 생성
      name: '새로운 상품',
      option: '옵션',
      price: 30000, // 상품 가격
      quantity: 1,
      orderAmount: 30000, // 주문 금액
    };

    // 현재 장바구니 데이터 가져오기
    const savedCartItems = localStorage.getItem('cartItems');
    let cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];

    // 장바구니에 새로운 상품 추가
    cartItems = [...cartItems, newItem];

    // 로컬 스토리지에 저장
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // 장바구니 페이지로 이동
    navigate('/cart');
  };

  return (
    <div>
      <h2>새로운 상품 페이지</h2>
      <button onClick={handleAddToCart}>장바구니에 추가하기</button>
    </div>
  );
}
