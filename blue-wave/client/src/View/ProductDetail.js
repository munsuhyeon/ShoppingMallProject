// 제품상세페이지입니다

import React from "react";
import Header from "./Header";
import ProductSection from "../Components/Product/ProductSection.js";
import ProductDetailToggle from "../Components/Product/ProductDetailToggle.js";
import InformationSection from "../Components/Product/InformationSection.js";
import ReviewSection from "../Components/Product/ReviewSection.js";
import BackToTop from "../Components/BackToTop/BackToTop";
import FixedNavbar from "../Components/Product/FixedNavbar/FixedNavbar.js";

function ProductDetail() {
  return (
    <div className="ProductDetail">
      <Header />
      <ProductSection />
      <FixedNavbar />
      <ProductDetailToggle />
      <ReviewSection />
      <InformationSection />
      <BackToTop />
    </div>
  );
}

export default ProductDetail;
