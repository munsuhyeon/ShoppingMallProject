import React from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

// ProductSection2 컴포넌트 정의
const ProductSection2 = ({ section }) => (
  <section id="product">
    <div className="product_container">
      <div className="content_title">
        <div className="title">
          <h1>{section.title}</h1>
          <div className="sub_title">
            <p>{section.subtitle}</p>
            <Link to={section.moreLink}>더보기</Link>
          </div>
        </div>
      </div>

      <ul className="product_all">
        {section.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ul>
    </div>
  </section>
);

export default ProductSection2;
