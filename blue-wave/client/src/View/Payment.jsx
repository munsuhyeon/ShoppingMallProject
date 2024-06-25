import { useState , useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paymentitem from "./Paymentitem";
import "./Payment.css";
import FinalPayment from "./FinalPayment";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // 랜덤 코드 생성 라이브러리
import OrderButton from "../UI/OrderButton";
import MultiPayment from "../Utils/Multipayment";
import { AuthContext } from "../Utils/AuthContext"

export default function Payment() {
  const { userId } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  const { REACT_APP_PortOne_StoreId } = process.env;
  const { REACT_APP_PortOne_ChannelKey, REACT_APP_PortOne_Kakao_ChannelKey } = process.env;

  const paymentMethods = [
    {
      paymentType: "카드 결제",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "CARD",
      paymentName: "카드 결제",
    },
    {
      paymentType: "실시간 계좌이체",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "TRANSFER",
      paymentName: "실시간 계좌이체",
    },
    {
      paymentType: "모바일 결제",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "MOBILE",
      paymentName: "모바일 결제",
    },
    {
      paymentType: "카카오 페이",
      channelKey: REACT_APP_PortOne_Kakao_ChannelKey,
      payMethod: "EASY_PAY",
      paymentName: "카카오 페이",
    },
  ];

  const [paymentItems, setPaymentItems] = useState(cartItems);
  const [paymentPerson, setPaymentPerson] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
    requestMessage: "",
  });
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!name || value === undefined || value === null) {
      console.error("Invalid input name or value");
      return;
    }
    setPaymentPerson((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const formatDateForMySQL = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      date.getUTCFullYear() +
      "-" +
      pad(date.getUTCMonth() + 1) +
      "-" +
      pad(date.getUTCDate()) +
      " " +
      pad(date.getUTCHours()) +
      ":" +
      pad(date.getUTCMinutes()) +
      ":" +
      pad(date.getUTCSeconds())
    );
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    const date = new Date();
    
    //const userInfo = { userid: "1" }; // Replace with actual user info
    const createOrderNumber =
      String(userId) +
      String(date.getFullYear()) +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0") +
      "-" +
      String(cartItems[0].id);

    const reqOrderSheet = cartItems.map((data) => ({
      ...data,
      order_number: createOrderNumber,
      user_id: userId,
      product_id: data.id,
      order_date: formatDateForMySQL(date), // 포맷된 날짜를 사용
      order_count: data.quantity,
      total_amount: totalPrice,
      total_count: cartItems.length,
      p_name: data.p_name,
    }));

    

    try {
      const response = await axios.post("http://localhost:8000/reqOrder", {
        orderSheet: reqOrderSheet,
        paymentPersonDB: paymentPerson, 
      });

      if (response.status === 200) {
        setPaymentItems([]); 
        localStorage.removeItem("cartItems"); 
        //alert("주문이 완료되었습니다.");
        navigate("/Paymentcomplete",{ state: {orderNumber: createOrderNumber, cartItems, paymentPerson} });
      } else {
        alert("주문에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  //-------------------------결제 메소드-------------------------

  const { paymentType, channelKey, payMethod, paymentName } = selectedPaymentMethod;

  let payResponse;

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        // jQuery 라이브러리를 비동기적으로 로드합니다.
        await loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
        // Portone의 브라우저 SDK를 비동기적으로 로드합니다.
        await loadScript("https://cdn.portone.io/v2/browser-sdk.js");
        // 스크립트가 성공적으로 로드되면 상태를 업데이트합니다.
        setIsScriptsLoaded(true);
      } catch (error) {
        // 스크립트 로딩 중 에러가 발생하면 콘솔에 에러 메시지를 출력합니다.
        console.error(error.message);
      }
    };

    // 컴포넌트가 마운트될 때 스크립트를 로드합니다.
    loadScripts();

    // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
    return () => {
      // 로드된 jQuery 스크립트를 찾습니다.
      const jquery = document.querySelector(
        'script[src="https://code.jquery.com/jquery-3.7.1.min.js"]'
      );
      // 로드된 Portone 브라우저 SDK 스크립트를 찾습니다.
      const iamport = document.querySelector(
        'script[src="https://cdn.portone.io/v2/browser-sdk.js"]'
      );
      // jQuery 스크립트가 있으면 head에서 제거합니다.
      if (jquery) document.head.removeChild(jquery);
      // Portone 브라우저 SDK 스크립트가 있으면 head에서 제거합니다.
      if (iamport) document.head.removeChild(iamport);
    };
  }, []); // 빈 배열을 사용하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.

  // 총 상품 금액을 구하는 메소드
  const totalProductAmount = () => {
    let sumAmount = 0;
    cartItems.forEach((item) => (sumAmount += item.price * item.quantity));
    return sumAmount;
  };

  const processPayment = async () => {
    if (!isScriptsLoaded) {
      alert("스크립트가 아직 로드되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    const { PortOne } = window;
    if (!PortOne) {
      alert("결제 SDK가 제대로 로드되지 않았습니다.");
      return;
    }

    try {
      if (paymentType === "카카오 페이") {
        payResponse = await PortOne.requestPayment({
          // Store ID 설정
          storeId: REACT_APP_PortOne_StoreId,
          // 채널 키 설정
          channelKey: channelKey,
          paymentId: `payment-${uuidv4()}`,
          orderName: `${cartItems[0].p_name} 외 ${cartItems.length - 1} 건`,
          totalAmount: totalProductAmount(),
          currency: "CURRENCY_KRW",
          payMethod: payMethod,
          productType: "PRODUCT_TYPE_REAL",
          easyPay: { easyPayProvider: "KAKAOPAY" },
        });
      } else {
        payResponse = await PortOne.requestPayment({
          storeId: REACT_APP_PortOne_StoreId,
          channelKey: channelKey,
          paymentId: `payment-${uuidv4()}`,
          orderName: `${cartItems[0].p_name} 외 ${cartItems.length - 1} 건`,
          totalAmount: totalProductAmount(),
          currency: "CURRENCY_KRW",
          payMethod: payMethod,
          productType: "PRODUCT_TYPE_REAL",
        });
      }

      if (payResponse.code) {
        alert(payResponse.message);
        return;
      }

      if (payResponse.transactionType === "PAYMENT") {
         handleOrder();
        //await handleOrder();
      }
    } catch (error) {
      alert("결제 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <div className="payment-body">
      <div className="body-header">
        <h2>결제화면</h2>
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
      <form className="info-payment-flex" onSubmit={(e) => {e.preventDefault(); processPayment();}}>
        <div className="info-part">
          <h2>배송정보</h2>
          <div className="orderer-info">
            <ul>
              <li className="orderer-name">성함</li>
              <li className="orderer-name">전화번호</li>
              <li className="orderer-name">이메일</li>
              <li className="orderer-name">주소</li>
              <li className="orderer-name">상세주소</li>
            </ul>
            <ul>
              <li className="orderer-input">
                <input
                  type="text"
                  name="name"
                  placeholder="성함을 입력해주세요"
                  value={paymentPerson.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </li>
              <li className="orderer-input">
                <input
                  type="tel"
                  name="phone"
                  placeholder="전화번호를 입력해주세요"
                  value={paymentPerson.phone || ""}
                  onChange={handleInputChange}
                  required
                />
              </li>
              <li className="orderer-input">
                <input
                  type="email"
                  name="email"
                  placeholder="이메일을 입력해주세요"
                  value={paymentPerson.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </li>
              <li className="orderer-input">
                <input
                  type="text"
                  name="address"
                  placeholder="주소를 입력해주세요"
                  value={paymentPerson.address || ""}
                  onChange={handleInputChange}
                  required
                />
              </li>
              <li className="orderer-input">
                <input
                  type="text"
                  name="detailAddress"
                  placeholder="상세주소를 입력해주세요"
                  value={paymentPerson.detailAddress || ""}
                  onChange={handleInputChange}
                  required
                />
              </li>
            </ul>
          </div>

          <div className="request-part">
            <p className="request-text">배송 시 요청사항</p>
            <input
              type="text"
              name="requestMessage"
              placeholder="요청사항을 입력해주세요"
              value={paymentPerson.requestMessage}
              onChange={handleInputChange}
            />
          </div>
          <div className="product-info">
            <h2>상품정보</h2>
            {paymentItems.map((item) => (
              <Paymentitem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="payment-part">
          <div className="payment-method">
            <h2>결제 수단</h2>
            <div>
              {paymentMethods.map((paymentData, index) => (
                <MultiPayment
                 key={`payment-${index}`} // 고유한 key prop 추가
                 paymentData={paymentData}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                 index={index} // index prop 추가
              />
              ))}
            </div>
          </div>
          <div className="final-payment">
            <FinalPayment totalPrice={totalPrice} />
            <div className="button">
              <OrderButton processPayment={processPayment}/>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
