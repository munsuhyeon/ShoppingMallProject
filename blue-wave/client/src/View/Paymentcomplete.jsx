import "./Paymentcomplete.css";
import { useLocation,Link } from "react-router-dom";
import Paymentcompleteitem from "./Paymentcompleteitem";


export default function Paymentcomplete() {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };
  const { paymentPerson } = location.state || { paymentPerson: {} };
  const { orderNumber } = location.state || { orderNumber: "" };

  return (
    <>
      <div className="paymentcomplete-body">
        <div className="Paymentcomplete-body-header">
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

        <div className="body-body">
          <div className="payment-complete-text">
            <h2>결제완료</h2>
            <img
              src={`${process.env.REACT_APP_HOST}/img/bluewavelogo.png`}
              alt="bluewavelogo"
            />
            <p>
              결제가 <span>완료</span>되었습니다
            </p>
          </div>

          <div className="payment-complete-info">
            <h3>주문자 정보 </h3>
            <ul>
              <li>
                <p>성함</p>
                <span>{paymentPerson.name}</span>
              </li>
              <li>
                <p>전화번호</p>
                <span>{paymentPerson.phone}</span>
              </li>
              <li>
                <p>주소</p>
                <span>{paymentPerson.address}</span>
              </li>
              <li>
                <p>상세 주소</p>
                <span>{paymentPerson.detailAddress}</span>
              </li>
              <li>
                <p>배송시 요청사항</p>
                <span>{paymentPerson.requestMessage}</span>
              </li>
            </ul>
          </div>

          <div className="payment-complete-info">
            <h3>
              결제상품 정보 <span>주문번호: {orderNumber}</span>
            </h3>
            {cartItems.map((cartCompleteData, index) => (
              <Paymentcompleteitem
                key={index}
                cartCompleteData={cartCompleteData}
              />
            ))}
          </div>
        </div>

        <div className="button">
        <Link to="/mypage?menu=OrderSheet" className="btn">주문 목록으로 가기</Link>
        </div>
      </div>
    </>
  );
}
