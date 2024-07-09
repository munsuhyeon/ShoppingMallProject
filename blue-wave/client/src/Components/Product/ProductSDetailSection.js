import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductSection.css";
import OptionList from "./OptionList/OptionList";

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

const ProductSection = () => {
  const navigate = useNavigate();
  // URL에서 카테고리, 서브 카테고리 및 제품 ID를 가져옴
  const { categoryId, subCategoryId, id } = useParams();
  const resolvedSubCategoryId = subCategoryId ? subCategoryId : "0"; // undefined일 경우 0으로 설정

  // 제품 데이터 상태
  const [product, setProduct] = useState(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 선택된 옵션 상태
  const [selectedOptions, setSelectedOptions] = useState({});
  // 메인 이미지 URL 상태
  const [mainImageSrc, setMainImageSrc] = useState("");
  // 설명 이미지 URL 상태
  const [descriptionImageSrc, setDescriptionImageSrc] = useState("");
  // 확대된 이미지 URL 상태
  const [zoomedImageSrc, setZoomedImageSrc] = useState("");
  // 서브 이미지 URL 상태
  const [subImageSrc, setSubImageSrc] = useState("");
  // 옵션 가격 상태
  const [optionPrices, setOptionPrices] = useState({});

  // 제품 데이터 및 옵션 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    // 제품 데이터를 가져오는 함수
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST}/product/${categoryId}/${resolvedSubCategoryId}/${id}`
        );
        //console.log("API 응답:", response.data);
        if (response.data) {
          setProduct(response.data);
          // 주 이미지 설정
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
          // 설명 이미지 설정
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

          // sub_image 설정
          if (typeof response.data.sub_image === "string") {
            setSubImageSrc(response.data.sub_image);
          } else if (
            Array.isArray(response.data.sub_image) &&
            response.data.sub_image.length > 0
          ) {
            setSubImageSrc(response.data.sub_image[0]);
          } else {
            console.warn("서브 이미지가 없습니다.");
          }
          // 확대된 이미지 설정 (처음에는 주 이미지로 설정)
          setZoomedImageSrc(response.data.main_image);
        } else {
          throw new Error("Product not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("상품 불러오기 오류:", error.message);
        setLoading(false);
      }
    };
    // 옵션 데이터를 가져오는 함수
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST}/product/${categoryId}/${resolvedSubCategoryId}/${id}/options`
        );
        //console.log("Options API response:", response.data);
        // 옵션 이름과 가격을 객체로 변환
        const prices = response.data.reduce((acc, option) => {
          acc[option.option_name] = option.option_price;
          return acc;
        }, {});
        // 옵션 가격 상태 설정
        setOptionPrices(prices);
      } catch (error) {
        console.error("옵션 불러오기 오류:", error.message);
      }
    };

    fetchProduct();
    fetchOptions();
  }, [categoryId, resolvedSubCategoryId, id]);

  //console.log(selectedOptions);
  // 작은 이미지에 마우스를 올렸을 때 이미지 변경 핸들러
  const handleSmallImageMouseOver = (originalSrc, zoomedSrc) => {
    setMainImageSrc(originalSrc);
    setZoomedImageSrc(zoomedSrc);
  };

  // 설명 이미지에 마우스를 올렸을 때 이미지 변경 핸들러
  const handleDescriptionImageMouseOver = () => {
    setMainImageSrc(descriptionImageSrc);
    setZoomedImageSrc(descriptionImageSrc);
  };

  // 서브 이미지에 마우스를 올렸을 때 이미지 변경 핸들러
  const handleSubImageMouseOver = () => {
    setMainImageSrc(subImageSrc);
    setZoomedImageSrc(subImageSrc);
  };

  // 옵션 클릭 핸들러
  const handleOptionClick = (optionName) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: 1,
    }));
  };

  // 옵션 수량 증가 핸들러
  const increaseOption = (optionName) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: prevOptions[optionName] + 1,
    }));
  };

  // 옵션 수량 감소 핸들러
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

  // 총 가격 계산 함수
  const calculateTotalPrice = () => {
    return Object.keys(selectedOptions).reduce((total, optionName) => {
      return total + selectedOptions[optionName] * optionPrices[optionName];
    }, 0);
  };

  // 총 가격 계산
  const totalPrice = calculateTotalPrice();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  // 옵션 리스트
  const options = Object.keys(optionPrices);
  //console.log(selectedOptions);
  //console.log(product);
  //console.log(product.p_name);

  const handleAddToCart = () => {
    // 선택된 옵션을 기반으로 상품 정보를 생성
    const cartItemsToAdd = Object.keys(selectedOptions).map((optionName) => ({
      id: product.product_id,
      image: mainImageSrc,
      p_name: product.p_name,
      option: optionName,
      price: optionPrices[optionName],
      quantity: selectedOptions[optionName],
      orderAmount: selectedOptions[optionName] * optionPrices[optionName],
    }));

    // 현재 장바구니 데이터 가져오기
    const savedCartItems = localStorage.getItem("cartItems");
    let cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];

    // 새로운 상품을 장바구니에 추가하거나 기존 상품의 수량을 업데이트
    cartItemsToAdd.forEach((cartItemToAdd) => {
      const existingItemIndex = cartItems.findIndex(
        (item) =>
          item.id === cartItemToAdd.id && item.option === cartItemToAdd.option
      );

      if (existingItemIndex !== -1) {
        // 이미 있는 상품이면 수량을 추가
        cartItems[existingItemIndex].quantity += cartItemToAdd.quantity;
      } else {
        // 새로운 상품을 장바구니에 추가
        cartItems.push(cartItemToAdd);
      }
    });

    // 로컬 스토리지에 장바구니 저장
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // 장바구니 페이지로 이동
    navigate("/cart");
  };

  const handleAddandpayment = () => {
    // 선택된 옵션을 기반으로 상품 정보를 생성
    const cartItemsToAdd = Object.keys(selectedOptions).map((optionName) => ({
      id: product.product_id,
      image: mainImageSrc,
      p_name: product.p_name,
      option: optionName,
      price: optionPrices[optionName],
      quantity: selectedOptions[optionName],
      orderAmount: selectedOptions[optionName] * optionPrices[optionName],
    }));

    // 현재 장바구니 데이터 가져오기
    const savedCartItems = localStorage.getItem("cartItems");
    let cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];

    // 새로운 상품을 장바구니에 추가하거나 기존 상품의 수량을 업데이트
    cartItemsToAdd.forEach((cartItemToAdd) => {
      const existingItemIndex = cartItems.findIndex(
        (item) =>
          item.id === cartItemToAdd.id && item.option === cartItemToAdd.option
      );

      if (existingItemIndex !== -1) {
        // 이미 있는 상품이면 수량을 추가
        cartItems[existingItemIndex].quantity += cartItemToAdd.quantity;
      } else {
        // 새로운 상품을 장바구니에 추가
        cartItems.push(cartItemToAdd);
      }
    });

    // 로컬 스토리지에 장바구니 저장
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // 결제 페이지로 이동
    navigate("/payment", { state: { cartItems } });
  };

  return (
    <section className="Product-Section">
      <div className="Product-Section-Inner">
        <div className="Product-ImageCard">
          <div className="Product-Image">
            <img
              className="original-image"
              src={mainImageSrc}
              alt="상품 이미지"
            />
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
            {typeof subImageSrc === "string" && subImageSrc && (
              <div className="Min-Image" onMouseOver={handleSubImageMouseOver}>
                <img src={subImageSrc} alt="서브 이미지" />
              </div>
            )}
          </div>
        </div>
        <div className="Product-ImageCard-Right">
          <div className="Right-Title">
            <h3>{formatPrice(product.p_price)}원</h3>
            <h4>{product.p_name}</h4>
          </div>
          <div className="Right-Delivery">
            <h5>배송정보</h5>
            <div className="DeliveryInfo">
              <div className="DeliveryInfo-2">
                <p>일반배송</p>
                <p>픽업</p>
              </div>
              <div className="DeliveryInfo-3">
                <p>
                  <span>|</span> 무료 (평균 3일 이내 배송)
                </p>
                <p>
                  <span>|</span> 배송비 조건 없음
                </p>
              </div>
            </div>
          </div>
          <div>
            <OptionList
              options={options}
              selectedOptions={selectedOptions}
              handleOptionClick={handleOptionClick}
              increaseOption={increaseOption}
              decreaseOption={decreaseOption}
              optionPrices={optionPrices}
              product={product}
            />
          </div>
          <div className="SelectedOptions">
            {Object.keys(selectedOptions).map((optionName) => (
              <div className="option-box" key={optionName}>
                <p>
                  <span className="optionItem" data-name={optionName}>
                    {optionName} - {formatPrice(optionPrices[optionName])}원{" "}
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
                      {selectedOptions[optionName]}
                    </span>
                    <button
                      className="increase"
                      onClick={() => increaseOption(optionName)}
                    >
                      +
                    </button>
                  </div>
                  <p className="option-price">
                    {formatPrice(optionPrices[optionName])}원
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="Right-Price">
            <p>상품금액 합계</p>
            <p>
              <span>{formatPrice(totalPrice)}</span> 원
            </p>
          </div>
          <div className="Right-Button">
            <div className="Right-basket">
              <button onClick={handleAddToCart}>장바구니</button>
            </div>
            <div className="Right-Buy">
              <button onClick={handleAddandpayment}>즉시구매</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
