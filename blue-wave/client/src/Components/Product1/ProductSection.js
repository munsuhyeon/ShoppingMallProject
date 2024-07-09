import React from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) => {
  return price.toLocaleString("ko-KR");
};

const ProductCard = ({ categoryId, subCategoryId, product }) => (
  <li className="product_card">
    <Link
      to={`/product/${product.categoryId}/${product.subCategoryId}/${product.id}`}
    >
      <div className="product_img">
        <img src={product.imgSrc} alt={product.name} />
      </div>

      <div className="product_info">
        <h4>{product.name}</h4> {/* 제품 이름 */}
        <p className="product_content">{product.content}</p> {/* 제품 내용 */}
        <p className="product_description">{product.description}</p>{" "}
        {/* 제품 설명 */}
      </div>

      <div className="product_price">
        <p className="price">{formatPrice(product.price)}원</p>{" "}
        {/* 제품 가격 */}
        <p>즉시구매</p>
      </div>
    </Link>
  </li>
);

const ProductSection = ({ section }) => (
  <section id="product">
    <div className="product_container">
      <div className="content_title">
        <div className="title">
          <h1>{section.title}</h1> {/* 제품 섹션의 제목 */}
          <div className="sub_title">
            <p>{section.subtitle}</p> {/* 제품 섹션의 소제목 */}
            <Link to={section.moreLink}>더보기</Link> {/* 더 보기 링크 */}
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

export default ProductSection;
