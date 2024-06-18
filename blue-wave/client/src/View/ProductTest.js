import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Pagination from "../Components/Product/Pagination/Pagination";
import BackToTop from "../Components/BackToTop/BackToTop";
import ProductDetail from "./ProductDetail";
import "./AllProduct.css";

const ProductTest = () => {
  const CategoryProducts = () => {
    const { categoryId, subCategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;

    useEffect(() => {
      async function fetchProducts() {
        try {
          const endpoint = subCategoryId
            ? `http://localhost:8000/categories/${categoryId}/subcategories/${subCategoryId}/products`
            : `http://localhost:8000/categories/${categoryId}/products`;
          const response = await axios.get(endpoint);
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }

      fetchProducts();
    }, [categoryId, subCategoryId]);

    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0); // 페이지 변경 시 화면을 맨 위로 스크롤
    };

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

      const totalPages = Math.ceil((products.length * 4) / productsPerPage);

      return (
        <ul className="Allproduct">
          {currentPosts.map((product, index) => (
            <li key={`${product.product_id}-${index}`} className="Product-Card">
              <Link to={`/product/${product.product_id}`}>
                <div className="Product-Thumbnail">
                  <img src={product.main_image} alt={product.p_name} />
                </div>
              </Link>
              <Link to={`/product/${product.product_id}`}>
                <div className="Product-Info">
                  <h4>{product.p_name}</h4>
                  <p className="Product-Description">
                    {product.description_image}
                  </p>
                </div>
              </Link>
              <Link to={`/product/${product.product_id}`}>
                <div className="Product-Price">
                  <span>{product.p_price}원</span>
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

    const totalPages = Math.ceil((products.length * 4) / productsPerPage);

    return (
      <div className="AllProduct">
        <Header />
        <div className="AllProduct-Section">
          <div className="AllProduct-title">
            <h3>카테고리 이름</h3>
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
        <BackToTop />
      </div>
    );
  };

  return (
    <Router>
      <CategoryProducts />
      <Switch>
        <Route path="/" exact>
          <CategoryProducts />
        </Route>
        <Route path="/category/:categoryId" exact>
          <CategoryProducts />
        </Route>
        <Route path="/category/:categoryId/subcategory/:subCategoryId" exact>
          <CategoryProducts />
        </Route>
        <Route path="/product/:id">
          <ProductDetail />
        </Route>
      </Switch>
      <BackToTop />
    </Router>
  );
};

export default ProductTest;
