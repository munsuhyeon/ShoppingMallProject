import { useLocation, Link } from "react-router-dom";
import "./SearchResults.css";
import Header from "./Header";
import Footer from "../Components/Footer/Footer";

const SearchResults = () => {
  const location = useLocation();
  const data = { ...location.state }; // 검색바에서 넘긴 검색결과
  const searchTerm = data.searchTerm;
  const products = data.result;

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (products === "Product not found") {
    return (
      <>
        <Header />
        <div className="search-results-container">
          <div className="fix">
            <p>
              <span>'{searchTerm}'</span>에 대한 검색 결과
            </p>
          </div>
          <p className="no-results">검색 결과가 없습니다.</p>
        </div>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="search-results-container">
          <div className="results">
            {products.map((product) => (
              <Link
                to={`/product/${product.category_id}/${product.sub_category_id}/${product.product_id}`}
                key={product.product_id}
              >
                <div className="Card">
                  <div className="Thumbnail">
                    <img src={product.main_image} alt={product.p_name} />
                  </div>
                  <div className="Info">
                    <h4>{product.p_name}</h4>
                    <p className="Description">{product.p_description}</p>
                  </div>
                  <div className="Price">
                    <span>{formatPrice(product.p_price)}원</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }
};
export default SearchResults;
