// 상세페이지에서 메인 썸네인 + 주문섹션이 있는 컴포넌트입니다
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductSection.css";
import OptionList from "./OptionList/OptionList";

const ProductSection = () => {
  // useParams Hook을 사용하여 URL에서 id 파라미터를 가져옵니다.
  const { id } = useParams();

  // 상태 변수들을 초기화합니다.
  // 상품 데이터 상태
  const [product, setProduct] = useState(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 선택된 옵션 상태
  const [selectedOptions, setSelectedOptions] = useState({});
  // 주 이미지 URL 상태
  const [mainImageSrc, setMainImageSrc] = useState("");
  // 설명 이미지 URL 상태(미니이미지)
  const [descriptionImageSrc, setDescriptionImageSrc] = useState("");
  // 확대된 이미지 URL 상태
  const [zoomedImageSrc, setZoomedImageSrc] = useState("");
  // 옵션 가격 상태
  const [optionPrices, setOptionPrices] = useState({});

  // useEffect Hook을 사용하여 컴포넌트가 마운트될 때와 id가 변경될 때 상품 데이터와 옵션 데이터를 가져옵니다.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // axios를 사용하여 id에 해당하는 상품 데이터를 가져옵니다.
        const response = await axios.get(`http://localhost:8000/product/${id}`);
        // API 응답을 콘솔에 출력합니다.
        console.log("API 응답:", response.data);
        if (response.data) {
          // 상품 데이터를 설정합니다.
          setProduct(response.data);

          // 주 이미지를 설정합니다.
          if (typeof response.data.main_image === "string") {
            setMainImageSrc(response.data.main_image);
          } else if (
            Array.isArray(response.data.main_image) &&
            response.data.main_image.length > 0
          ) {
            setMainImageSrc(response.data.main_image[0]);
          } else {
            console.warn("주 이미지가 없습니다.");
          }
          // 설명 이미지를 설정합니다.
          if (typeof response.data.description_image === "string") {
            setDescriptionImageSrc(response.data.description_image);
          } else if (
            Array.isArray(response.data.description_image) &&
            response.data.description_image.length > 0
          ) {
            setDescriptionImageSrc(response.data.description_image[0]);
          } else {
            console.warn("설명 이미지가 없습니다.");
          }
          // 확대된 이미지를 설정합니다.
          setZoomedImageSrc(response.data.main_image);
        } else {
          throw new Error("Product not found");
        }

        // 로딩 상태를 false로 설정하여 로딩 중임을 표시합니다.
        setLoading(false);
      } catch (error) {
        console.error("상품 불러오기 오류:", error.message);
        setLoading(false);
      }
    };

    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          // axios를 사용하여 id에 해당하는 상품의 옵션 데이터를 가져옵니다.
          `http://localhost:8000/product/${id}/options`
        );
        console.log("Options API response:", response.data); // 콘솔 로그 확인

        // 옵션 데이터에서 옵션 이름과 가격을 추출하여 객체로 변환합니다.
        const prices = response.data.reduce((acc, option) => {
          acc[option.option_name] = option.option_price;
          return acc;
        }, {});
        // 옵션 가격 상태를 설정합니다.
        setOptionPrices(prices);
      } catch (error) {
        console.error("옵션 불러오기 오류:", error.message);
      }
    };
    // fetchProduct 함수를 호출하여 상품 데이터를 가져옵니다.
    fetchProduct();
    // fetchOptions 함수를 호출하여 옵션 데이터를 가져옵니다.
    fetchOptions();
    // useEffect의 의존성 배열에 id를 넣어 id가 변경될 때마다 호출됩니다.
  }, [id]);

  // 주 이미지와 확대된 이미지를 설정하는 함수입니다.
  const handleSmallImageMouseOver = (originalSrc, zoomedSrc) => {
    setMainImageSrc(originalSrc);
    setZoomedImageSrc(zoomedSrc);
  };

  // 미니 이미지를 설정하는 함수입니다.
  const handleDescriptionImageMouseOver = () => {
    setMainImageSrc(descriptionImageSrc);
    setZoomedImageSrc(descriptionImageSrc);
  };

  // 옵션을 클릭했을 때 선택된 옵션을 설정하는 함수입니다.
  const handleOptionClick = (optionName) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: 1,
    }));
  };

  // 옵션 수를 증가시키는 함수입니다.
  const increaseOption = (optionName) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: prevOptions[optionName] + 1,
    }));
  };

  // 옵션 수를 감소시키는 함수입니다.
  const decreaseOption = (optionName) => {
    setSelectedOptions((prevOptions) => {
      const newOptions = { ...prevOptions };
      if (newOptions[optionName] > 1) {
        newOptions[optionName]--;
      } else {
        delete newOptions[optionName];
      }
      return newOptions;
    });
  };

  // 선택된 옵션의 총 가격을 계산하는 함수입니다.
  const calculateTotalPrice = () => {
    return Object.keys(selectedOptions).reduce((total, optionName) => {
      return total + selectedOptions[optionName] * optionPrices[optionName];
    }, 0);
  };

  // 총 가격을 계산합니다.
  const totalPrice = calculateTotalPrice();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  // 옵션 가격 데이터에서 옵션 이름을 추출합니다.
  const options = Object.keys(optionPrices);

  return (
    <section className="Product-Section">
      <div className="Product-Section-Inner">
        <div className="Product-ImageCard">
          <div className="Product-Image">
            {/* 주 이미지를 표시합니다. */}
            <img
              className="original-image"
              src={mainImageSrc}
              alt="상품 이미지"
            />
            {/* 확대된 이미지를 표시합니다. */}
            {zoomedImageSrc && (
              <div className="zoom-container">
                <img
                  className="zoomed-image"
                  src={zoomedImageSrc}
                  alt="확대된 이미지"
                />
              </div>
            )}
          </div>
          <div className="Small-Image">
            {/* 주 이미지와 설명 이미지를 작은 이미지로 표시합니다. */}
            {typeof product.main_image === "string" && (
              <div
                className="Min-Image"
                onMouseOver={() =>
                  handleSmallImageMouseOver(
                    product.main_image,
                    product.main_image
                  )
                }
              >
                <img src={product.main_image} alt="주 이미지" />
              </div>
            )}
            {typeof descriptionImageSrc === "string" && (
              <div
                className="Min-Image"
                onMouseOver={handleDescriptionImageMouseOver}
              >
                <img src={descriptionImageSrc} alt="설명 이미지" />
              </div>
            )}
          </div>
        </div>
        <div className="Product-ImageCard-Right">
          <div className="Right-Title">
            <h3>{product.p_price}원</h3>
            <h4>{product.p_name}</h4>
          </div>
          <div className="Right-Delivery">
            <h5>배송정보</h5>
            <div className="DeliveryInfo">
              <div className="DeliveryInfo-2">
                <p>일반배송</p>
                <p>당일배송</p>
                <p>픽업</p>
              </div>
              <div className="DeliveryInfo-3">
                <p>
                  <span>|</span> 무료 (평균 3일 이내 배송)
                </p>
                <p>
                  <span>|</span> 2,500원 또는 5,000원
                </p>
                <p>
                  <span>|</span> 배송비 조건 없음
                </p>
              </div>
            </div>
          </div>
          <div>
            {/* OptionList.js 연결 */}
            <OptionList
              // 옵션 리스트 전달
              options={options}
              // 선택된 옵션 전달
              selectedOptions={selectedOptions}
              // 옵션 클릭 핸들러 전달
              handleOptionClick={handleOptionClick}
              // 옵션 증가 핸들러 전달
              increaseOption={increaseOption}
              // 옵션 감소 핸들러 전달
              decreaseOption={decreaseOption}
              // 옵션 가격 데이터 전달
              optionPrices={optionPrices}
            />
          </div>
          <div className="SelectedOptions">
            {/* 선택된 옵션을 표시합니다. */}
            {Object.keys(selectedOptions).map((optionName) => (
              <div className="option-box" key={optionName}>
                <p>
                  {/* 옵션 이름과 가격 표시 */}
                  <span className="optionItem" data-name={optionName}>
                    {optionName} - {optionPrices[optionName]}원{" "}
                  </span>
                </p>
                <div className="option-flex">
                  <div className="option-crease">
                    <button
                      className="decrease"
                      onClick={() => decreaseOption(optionName)}
                    >
                      -
                    </button>
                    <span className="quantity">
                      {/* 선택된 옵션 개수 표시 */}
                      {selectedOptions[optionName]}
                    </span>
                    <button
                      className="increase"
                      onClick={() => increaseOption(optionName)}
                    >
                      +
                    </button>
                  </div>
                  <p className="option-price">{optionPrices[optionName]}원</p>
                </div>
              </div>
            ))}
          </div>
          <div className="Right-Price">
            {/* 총 상품금액 합계를 표시합니다. */}
            <p>상품금액 합계</p>
            <p>
              {/* 총 상품금액 표시 */}
              <span>{totalPrice}</span> 원
            </p>
          </div>
          <div className="Right-Button">
            <div className="Right-basket">
              <button>장바구니</button>
            </div>
            <div className="Right-Buy">
              <button>즉시구매</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
