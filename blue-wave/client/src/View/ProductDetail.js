// 제품상세페이지입니다

import React from "react";
import ProductSDetailSection from "../Components/Product/ProductSDetailSection.js";
import ProductDetailToggle from "../Components/Product/ProductDetailToggle.js";
import InformationSection from "../Components/Product/InformationSection.js";
import ReviewSection from "../Components/Product/ReviewSection.js";
import BackToTop from "../Components/BackToTop/BackToTop";
import FixedNavbar from "../Components/Product/FixedNavbar/FixedNavbar.js";
import Header from "./Header.js";
function ProductDetail() {
  return (
    <div className="ProductDetail">
      <Header />
      <ProductSDetailSection />
      <FixedNavbar />
      <ProductDetailToggle />
      <ReviewSection />
      <InformationSection />
      <BackToTop />
    </div>
  );
}

export default ProductDetail;
