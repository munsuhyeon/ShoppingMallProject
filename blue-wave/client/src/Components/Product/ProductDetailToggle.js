import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductDetailToggle.css";

const ProductDetailToggle = ({ productId }) => {
  // 상태 변수들을 초기화합니다.
  // 상세 내용 펼침 여부 상태
  const [isExpanded, setIsExpanded] = useState(false);
  // 상세 이미지 URL 상태
  const [descriptionImage, setDescriptionImage] = useState("");
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 오류 발생 여부 상태
  const [error, setError] = useState(false);

  // 상세 내용 펼치기/접기 토글 함수
  const toggleDetail = () => {
    setIsExpanded(!isExpanded);
  };

  // useEffect Hook을 사용하여 컴포넌트가 마운트될 때와 productId가 변경될 때 데이터를 가져옵니다.
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // axios를 사용하여 productId에 해당하는 상품 데이터를 가져옵니다.
        const response = await axios.get(
          `http://localhost:8000/product/${productId}`
        );
        // 가져온 데이터에서 상세 이미지 URL을 설정합니다.
        console.log("API 응답:", response.data);
        if (response.data && response.data.description_image) {
          setDescriptionImage(response.data.description_image);
        } else {
          console.warn("상품 정보를 찾을 수 없습니다.");
          // 데이터가 없을 경우 오류 상태를 설정합니다.
          setError(true);
        }
      } catch (error) {
        console.error("상품 정보를 불러오는 중 오류 발생:", error);
        // 데이터를 가져오는 도중 오류가 발생할 경우 오류 상태를 설정합니다.
        setError(true);
      } finally {
        // 로딩 상태를 false로 설정하여 로딩 중임을 표시합니다.
        setLoading(false);
      }
    };
    // fetchProductData 함수를 호출하여 데이터를 가져옵니다.
    fetchProductData();
    // useEffect의 의존성 배열에 productId를 넣어 productId가 변경될 때마다 호출됩니다.
  }, [productId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>상품 정보를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="ProductInfo-Container">
      <div
        className="ProductInfo-ImageWrapper"
        style={{
          height: isExpanded ? "100%" : "600px",
          overflowY: isExpanded ? "auto" : "hidden",
        }}
      >
        {descriptionImage ? (
          <img
            src={descriptionImage}
            alt="상세 이미지"
            className="AutoHeightImage"
          />
        ) : (
          <div>이미지를 불러올 수 없습니다.</div>
        )}
        {!isExpanded && <div className="ProductInfo-GradientOverlay"></div>}
      </div>
      <button className="ProductInfo-OpenButton" onClick={toggleDetail}>
        {isExpanded ? "상품 상세 닫기" : "상품 상세 더보기"}
      </button>
    </div>
  );
};

const ProductInfoSection = () => {
  // 현재 URL에서 productId를 추출하는 예제
  const productId = window.location.pathname.split("/")[2]; // 예: /product/11

  return (
    <section id="ProductInfo-Section">
      {/* 경고문 */}
      <div className="Notation-warning">
        <p>
          <i className="fa-solid fa-exclamation"></i> 판매자가 현금거래를
          요구하면 거부하시고 즉시 사기 거래 신고센터(1670-9832)에 신고하시기
          바랍니다.
        </p>
      </div>
      {/* 필수 표기정보 표  */}
      <div className="Notation">
        <p>필수 표기정보</p>
        <div className="Notation-Details">
          <table>
            <thead>
              <tr>
                <th>품명 및 모델명</th>
                <th>반려동물 사진</th>
                <th>인증 / 허가</th>
                <th>해당사항 없음</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>제조국(원산지)</td>
                <td>한국</td>
                <td>제조자(수입자)</td>
                <td>Blue Wave</td>
              </tr>
              <tr>
                <td>소비자상담 관련 전화번호</td>
                <td>1111-1111</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 제품상세 더보기를 불러옵니다 */}
        <ProductDetailToggle productId={productId} />
      </div>
    </section>
  );
};

export default ProductInfoSection;
