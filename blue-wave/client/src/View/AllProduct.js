import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Pagination from "../Components/Product/Pagination/Pagination";
import BackToTop from "../Components/BackToTop/BackToTop";
import ProductDetail from "./ProductDetail";
import "./AllProduct.css";
import Main from "./Main"; // Main 컴포넌트 import 추가
import Register from "./Register"; // Register 컴포넌트 import 추가

// 페이지 이동 시 화면을 맨 위로 스크롤하는 컴포넌트
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // pathname이 변경될 때마다 페이지 맨 위로 스크롤
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

// 카테고리별 제품 목록을 표시하는 컴포넌트
const CategoryProducts = () => {
  // URL에서 카테고리 및 서브 카테고리 ID를 가져옴
  const { categoryId, subCategoryId } = useParams();

  // 상품 데이터 상태
  const [products, setProducts] = useState([]);

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지당 제품 수
  const productsPerPage = 15;

  // 카테고리 및 서브 카테고리가 변경될 때마다 현재 페이지를 1로 설정
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, subCategoryId]);

  // 카테고리 및 서브 카테고리에 따라 제품 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    async function fetchData() {
      try {
        const endpoint = subCategoryId
          ? `http://localhost:8000/product/${categoryId}/${subCategoryId}`
          : `http://localhost:8000/product/${categoryId}`;

        const response = await axios.get(endpoint);
        // 제품 상태 설정
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchData();
  }, [categoryId, subCategoryId]);

  // 페이지 클릭 핸들러
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 화면을 맨 위로 스크롤
  };

  // 제품 목록을 렌더링하는 함수
  const renderProductList = () => {
    const repeatedProducts = products.flatMap((product) =>
      Array.from({ length: 4 }, () => product)
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
              to={`/product/${categoryId}/${subCategoryId}/${product.product_id}`}
              className="Product-Link"
            >
              <div className="Product-Thumbnail">
                <img src={product.main_image} alt={product.p_name} />
              </div>
            </Link>
            <Link
              to={`/product/${categoryId}/${subCategoryId}/${product.product_id}`}
              className="Product-Link"
            >
              <div className="Product-Info">
                <h4>{product.p_name}</h4>
                <p className="Product-Description">{product.p_description}</p>
              </div>
            </Link>
            <Link
              to={`/product/${categoryId}/${subCategoryId}/${product.product_id}`}
              className="Product-Link"
            >
              <div className="Product-Price">
                <span>{formatPrice(product.p_price)}원</span>
              </div>
              <div className="star-ratings">
                <div className="star-ratings-fill">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil((products.length * 4) / productsPerPage);

  // 카테고리 이름 설정
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

  // 카테고리에 맞는 신규 상품 5개를 필터링하는 함수
  const filterNewProductsByCategory = () => {
    if (!products || products.length === 0) {
      return [];
    }

    const filtered = products.filter(
      (product) => product.category_id === parseInt(categoryId)
    );

    return filtered.slice(0, 5); // 최대 5개의 상품만 반환
  };

  // 카테고리에 맞는 신규 상품 목록 가져오기
  const filteredNewProducts = filterNewProductsByCategory();

  return (
    <>
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
                to={`/product/${categoryId}/${subCategoryId}/${product.product_id}`}
                className="Product-Link"
              >
                <div className="Product-Thumbnail">
                  <img src={product.main_image} alt={product.p_name} />
                </div>
              </Link>
              <Link
                to={`/product/${categoryId}/${subCategoryId}/${product.product_id}`}
                className="Product-Link"
              >
                <div className="Product-Info">
                  <h4>{product.p_name}</h4>
                  <p className="Product-Description">{product.p_description}</p>
                </div>
              </Link>
              <Link
                to={`/product/${categoryId}/${subCategoryId}/${product.product_id}`}
                className="Product-Link"
              >
                <div className="Product-Price">
                  <span>{formatPrice(product.p_price)}원</span>
                </div>
                <div className="star-ratings">
                  <div className="star-ratings-fill">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
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
// 전체 라우팅을 담당하는 컴포넌트
const Product = () => {
  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/product/:categoryId" exact>
          <Header />
          <CategoryProducts />
        </Route>
        <Route path="/product/:categoryId/:subCategoryId" exact>
          <Header />
          <CategoryProducts />
        </Route>
        <Route path="/product/:categoryId/:subCategoryId/:id">
          <ProductDetail />
        </Route>
      </Switch>
      <BackToTop />
    </Router>
  );
};

export default Product;
