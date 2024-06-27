import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cartitem from "./Cartitem";
import "./Cart.css";
import { AuthContext } from "../Utils/AuthContext";
import Header from "./Header";
import Footer from "../Components/Footer/Footer";

export default function Cart() {
  const navigate = useNavigate();

  // 처음 로드될 때 로컬 스토리지에서 장바구니 데이터를 불러옵니다
  const getInitialCartItems = () => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  };

  const [cartItems, setCartItems] = useState(getInitialCartItems);

  useEffect(() => {
    // cartItems가 변경될 때마다 로컬 스토리지에 저장합니다
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleDelete = (id, option) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter(
        (item) => !(item.id === id && item.option === option)
      )
    );
  };

  const handleDeleteAll = () => {
    setCartItems([]);
  };

  const handleOrder = () => {
    navigate("/payment", { state: { cartItems } });
  };

  // 새로운 updateQuantity 함수 추가
  const updateQuantity = (id, option, newQuantity) => {
    setCartItems((prevCartItems) => {
      // 같은 상품의 같은 옵션인 항목을 찾습니다
      const existingCartItemIndex = prevCartItems.findIndex(
        (item) => item.id === id && item.option === option
      );

      if (existingCartItemIndex !== -1) {
        // 이미 있는 경우 해당 항목의 수량을 증가시킵니다
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[existingCartItemIndex].quantity = newQuantity;
        return updatedCartItems;
      } else {
        // 없는 경우 새로운 항목으로 추가합니다
        return [
          ...prevCartItems,
          {
            id: id,
            option: option,
            quantity: newQuantity,
            // 아래는 예시 데이터로, 실제로 사용하는 데이터에 맞게 수정 필요
            p_name: "Product Name",
            price: "10000",
            image: "product_image_url",
          },
        ];
      }
    });
  };

  return (
    <>
      <Header />
      <div className="shopping-basket">
        <div className="cart-body-header">
          <h2>장바구니</h2>
          <div className="page">
            <p className="page-1">
              장바구니<span>{">"}</span>
            </p>
            <p className="page-2">
              결제화면<span>{">"}</span>
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
            {cartItems.map((item, index) => (
              <Cartitem
                key={`${item.id}-${item.option}`} // 고유 식별자 설정
                item={item}
                onDelete={handleDelete}
                updateQuantity={updateQuantity}
              />
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
      <Footer />
    </>
  );
}
