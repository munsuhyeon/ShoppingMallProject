// 상세페이지 더보기
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductDetailToggle.css";

const ProductDetailToggle = ({ categoryId, subCategoryId, productId }) => {
  // 상태 변수들을 초기화합니다.
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionImage, setDescriptionImage] = useState("");
  const [error, setError] = useState(false);

  const toggleDetail = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          // 주소 수정필요
          `${process.env.REACT_APP_HOST}/product/${categoryId}/${subCategoryId}/${productId}`
        );
        if (response.data && response.data.description_image) {
          setDescriptionImage(response.data.description_image);
        } else {
          console.warn("상품 정보를 찾을 수 없습니다.");
          setError(true);
        }
      } catch (error) {
        console.error("상품 정보를 불러오는 중 오류 발생:", error);
        setError(true);
      }
    };
    fetchProductData();
  }, [productId]);

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
  const productId = window.location.pathname.split("/")[4]; // 예: /product/11
  return (
    <section id="ProductInfo-Section">
      <div className="Notation-warning">
        <p>
          <i className="fa-solid fa-exclamation"></i> 판매자가 현금거래를
          요구하면 거부하시고 즉시 사기 거래 신고센터(1670-9832)에 신고하시기
          바랍니다.
        </p>
      </div>
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
        <ProductDetailToggle productId={productId} />
      </div>
    </section>
  );
};

export default ProductInfoSection;
