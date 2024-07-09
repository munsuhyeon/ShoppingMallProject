import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Utils/AuthContext";
import axios from "axios";
import "./OrderSheet.css";
import Review from "./Review";
import Button from "../../UI/Button";

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

const OrderSheet = () => {
  const { userId } = useContext(AuthContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(0); // 선택된 기간을 저장하는 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호

  const ordersPerPage = 3; // 한 번에 표시할 주문 내역 수

  const fetchOrders = async (months) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST}/api/orders?months=${months}&userId=${userId}`
      );
      setOrderData(response.data);
      setSelectedPeriod(months); // 선택된 기간 업데이트
      setCurrentPage(1); // 페이지 초기화
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 오늘의 주문 내역을 가져옴
    fetchOrders(0); // 0개월은 오늘의 주문 내역을 의미함
  }, []);

  // 현재 페이지에 해당하는 주문 내역 계산
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);
  //console.log(currentOrders)

  // 페이지 번호 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 2자리로 맞추기
    const day = ("0" + date.getDate()).slice(-2); // 2자리로 맞추기
    return `${year}-${month}-${day}`;
  };
  // console.log(currentOrders)
  return (
    <div className="ordersheet">
      <div className="order_inquiry">
        <h1>주문조회</h1>
      </div>
      <div className="period_month">
        <button
          className={`btn ${selectedPeriod === 1 ? "selected" : ""}`}
          onClick={() => fetchOrders(1)}
        >
          한달전
        </button>
        <button
          className={`btn ${selectedPeriod === 3 ? "selected" : ""}`}
          onClick={() => fetchOrders(3)}
        >
          3개월 전
        </button>
        <button
          className={`btn ${selectedPeriod === 6 ? "selected" : ""}`}
          onClick={() => fetchOrders(6)}
        >
          6개월 전
        </button>
      </div>
      <div className="order">
        <div className="order_list"></div>
        <div className="order_table">
          {loading ? (
            <div>Loading...</div>
          ) : currentOrders.length === 0 ? (
            <div>주문내역이 없습니다</div>
          ) : (
            <table className="ordersheet_table">
              <thead className="ordersheet_thead">
                <tr>
                  <th style={{ width: "20%" }}>주문번호</th>
                  <th style={{ width: "15%" }}>IMAGE</th>
                  <th style={{ width: "15%" }}>상품명</th>
                  <th style={{ width: "5%" }}>수량</th>
                  <th style={{ width: "15%" }}>가격</th>
                  <th style={{ width: "10%" }}>주문일시</th>
                  <th style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody className="ordersheet_tbody">
                {currentOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_number}</td>
                    <td>
                      <img
                        src={order.main_image}
                        alt={order.p_name}
                        style={{ width: "130px" }}
                      />
                    </td>
                    <td>{order.p_name}</td>
                    <td>{order.order_count}</td>
                    <td>{formatPrice(order.total_amount)}원</td>
                    <td className="order_time">
                      {formatDate(order.order_date)}
                    </td>
                    <td>
                      {order.review_yn === "N" ? (
                        <Review
                          className="btn"
                          orderId={order.order_id}
                          productId={order.product_id}
                          userId={order.user_id}
                          pname={order.p_name}
                          mainimage={order.main_image}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pagination">
          <button
            className="btn pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <button
            className="btn pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastOrder >= orderData.length}
          >
            다음
          </button>
        </div>
        <div className="order_guide">
          <p className="headline">
            <span>취소/반품/교환 </span>신청전 확인해주세요!
            <br />
          </p>
          <span>취소</span>
          <br />
          <p className="subtitle">
            - 상품은 취소 시 수수료가 발생할 수 있으며,
            <br />
            취소수수료를 확인하여 2일 이내(주말,공휴일 제외) 처리결과를 문자로
            안내해드립니다.(당일 접수 기준, 마감시간 오후 4시)
            <br />- 상품은 금일 취소 신청 시 취소수수료가 발생되지 않습니다.{" "}
            <a href="#">주문취소 &gt;</a>
            <br />
          </p>
          <span>반품</span>
          <br />
          <p className="subtitle">
            - 상품 수령 후 7일 이내 신청하여 주세요.
            <br />
            - 상품이 출고된 이후에는 배송 완료 후, 반품 상품을 회수합니다.
            <br />
          </p>
          <span>교환</span>
          <p className="subtitle">
            - 상품의 교환 신청은 고객센터로 문의하여 주세요.{" "}
            <a href="#">고객센터 &gt; </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSheet;
