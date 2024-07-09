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
        {/* 제품이름 */}
        <h4>{product.name}</h4>
        {/* 제품 내용 */}
        <p className="product_content">{product.content}</p>
        {/* 제품 설명 */}
        <p className="product_description">{product.description}</p>
      </div>

      <div className="product_price">
        <p className="price">{formatPrice(product.price)}원</p>
        <p>즉시구매</p>
      </div>
    </Link>
  </li>
);

export default ProductCard;
