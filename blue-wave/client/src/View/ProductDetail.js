// 제품상세페이지입니다
import { useParams } from "react-router-dom";
import React, { useEffect,useState } from "react";
import axios from "axios";
import ProductSDetailSection from "../Components/Product/ProductSDetailSection.js";
import ProductDetailToggle from "../Components/Product/ProductDetailToggle.js";
import InformationSection from "../Components/Product/InformationSection.js";
import ReviewSection from "../Components/Product/ReviewSection.js";
import BackToTop from "../Components/BackToTop/BackToTop";
import FixedNavbar from "../Components/Product/FixedNavbar/FixedNavbar.js";
import Header from "./Header.js";
function ProductDetail() {
  const { categoryId, subCategoryId, id } = useParams();
  const resolvedSubCategoryId = subCategoryId ? subCategoryId : "0"; // undefined일 경우 0으로 설정
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
  useEffect(() => {
    const fetchReview = async () => {
      try{
        const response = await axios.get(
          `${process.env.REACT_APP_HOST}/review/${categoryId}/${resolvedSubCategoryId}/${id}`
        );
        //console.log("API 응답:", response.data);
        if (response.data.message === "no review"){
          setReviews(response.data);
        }else{
          setReviews(response.data);
        }
      }catch(error){
        console.error("리뷰를 가져오는 중 오류 발생:", error);
      }
    }
    fetchReview();
  },[categoryId, resolvedSubCategoryId, id])
  return (
    <div className="ProductDetail">
      <Header />
      <ProductSDetailSection />
      <FixedNavbar />
      <ProductDetailToggle />
      <ReviewSection reviews={reviews}/>
      <InformationSection />
      <BackToTop />
    </div>
  );
}

export default ProductDetail;
