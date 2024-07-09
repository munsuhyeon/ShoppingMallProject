import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "../Components/Product/Pagination/Pagination";
import BackToTop from "../Components/BackToTop/BackToTop";
import "./AllProduct.css";
import Header from "./Header";

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

// 카테고리별 제품 목록을 표시하는 컴포넌트
const CategoryProducts = () => {
  const { categoryId, subCategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoint = subCategoryId
          ? `${process.env.REACT_APP_HOST}/product/${categoryId}/${subCategoryId}`
          : `${process.env.REACT_APP_HOST}/product/${categoryId}`;

        const response = await axios.get(endpoint);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchData();
  }, [categoryId, subCategoryId]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderProductList = () => {
    const repeatedProducts = products.flatMap((product) =>
      Array.from({ length: 1 }, () => product)
    );

    const indexOfLastPost = currentPage * productsPerPage;
    const indexOfFirstPost = indexOfLastPost - productsPerPage;
    const currentPosts = repeatedProducts.slice(
      indexOfFirstPost,
      indexOfLastPost
    );
    return (
      <ul className="Allproduct">
        {currentPosts.map((product, index) => (
          <li key={`${product.product_id}-${index}`} className="Product-Card">
            <Link
              to={`/product/${product.category_id}/${product.sub_category_id}/${product.product_id}`}
              className="Product-Link"
            >
              <div className="Product-Thumbnail">
                <img src={product.main_image} alt={product.p_name} />
              </div>

              <div className="Product-Info">
                <h4>{product.p_name}</h4>
                <p className="Product-Description">{product.p_description}</p>
              </div>

              <div className="Product-Price">
                <span>{formatPrice(product.p_price)}원</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const totalPages = Math.ceil((products.length * 1) / productsPerPage);

  let categoryName = "";
  switch (categoryId) {
    case "1":
      categoryName = "인테리어";
      break;
    case "2":
      categoryName = "디지털";
      break;
    case "3":
      categoryName = "스포츠";
      break;
    case "4":
      categoryName = "도서";
      break;
    case "5":
      categoryName = "사무용품";
      break;
    case "6":
      categoryName = "반려동물용품";
      break;
    default:
      categoryName = "";
      break;
  }

  const filterNewProductsByCategory = () => {
    if (!products || products.length === 0) {
      return [];
    }

    const filtered = products.filter(
      (product) => product.category_id === parseInt(categoryId)
    );

    return filtered.slice(0, 5);
  };

  const filteredNewProducts = filterNewProductsByCategory();

  return (
    <>
      <Header />
      <div className="AllProduct-Section">
        <div className="AllProduct-title">
          <h3>{categoryName}</h3>
          <p>New Product</p>
        </div>
        <div className="Product-List">{renderProductList()}</div>
        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pagesToShow={10}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
      <div className="AllProduct-Section2">
        <div className="AllProduct-title">
          <h3>신규 상품</h3>
          <p>New Product</p>
        </div>
        <ul className="Allproduct">
          {filteredNewProducts.map((product) => (
            <li key={product.product_id} className="Product-Card">
              <Link
                to={`/product/${product.category_id}/${product.sub_category_id}/${product.product_id}`}
                className="Product-Link"
              >
                <div className="Product-Thumbnail">
                  <img src={product.main_image} alt={product.p_name} />
                </div>

                <div className="Product-Info">
                  <h4>{product.p_name}</h4>
                  <p className="Product-Description">{product.p_description}</p>
                </div>

                <div className="Product-Price">
                  <span>{formatPrice(product.p_price)}원</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <BackToTop />
    </>
  );
};

export default CategoryProducts;
