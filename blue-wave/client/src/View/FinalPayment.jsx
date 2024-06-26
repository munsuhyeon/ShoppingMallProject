import React from "react";

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export default function FinalPayment({ totalPrice }) {
  // Assuming item is passed as props
  return (
    <>
      <div className="final-payment-box">
        <h2>최종 결제금액</h2>
        <p>
          상품금액<span>{formatPrice(totalPrice)}원</span>
        </p>
        <p>
          배송비<span>배송비 무료</span>
        </p>
        <p>
          결제금액<span>{formatPrice(totalPrice)}원</span>
        </p>
      </div>
      <label>
        <input type="checkbox" required /> 주문 내용을 확인했으며 서비스 약관 및
        결제에 동의합니다.
      </label>
      <label>
        <input type="checkbox" required /> [필수] 개인정보 수집 및 이용 동의{" "}
        <a href="#">자세히</a>
      </label>
      <label>
        <input type="checkbox" required /> [필수] 개인정보 제 3자 제공 동의{" "}
        <a href="#">자세히</a>
      </label>
      <label>
        <input type="checkbox" required /> [필수] 전자결제대행 이용 동의{" "}
        <a href="#">자세히</a>
      </label>
    </>
  );
}
