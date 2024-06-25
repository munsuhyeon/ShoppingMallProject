import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "./AllProduct.css";
import Header from "./Header";
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
    const [products, setProducts] = useState([]); // 검색된 상품 상태
    const [error, setError] = useState(null); // 에러 메시지 상태
    const [noResults, setNoResults] = useState(false); // 검색 결과 없음 상태
    const query = useQuery();
    const searchTerm = query.get("query");

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/search`, { term: searchTerm });

                if (response.data.length === 0) {
                    setNoResults(true); // 검색 결과 없음 상태 업데이트
                } else {
                    setNoResults(false); // 검색 결과 있음 상태 업데이트
                    setProducts(response.data); // 검색된 상품 상태 업데이트
                }
            } catch (err) {
                console.error('검색 결과를 가져올 수 없습니다:', err); // 에러 메시지 상태 업데이트
                setError(err.message);
            }
        };

        fetchSearchResults(); // 검색 결과 가져오는 함수 호출
    }, [searchTerm]);

    // 가격 포맷팅 함수
    const formatPrice = (price) => {
        return new Intl.NumberFormat("ko-KR").format(price);
    };

    return (
        <div className="search-results-container">
        <Header />
            <h1>{searchTerm}에 대한 검색 결과</h1>
            {noResults && <p className="no-results">검색 결과가 없습니다.</p>}
            {error && <p className="error">{error}</p>} {/* 에러 메시지 표시 */}
            <div className="product-results">
                {products.map((product) => (
                    <div key={product.product_id} className="Product-Card">
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
                        <div className="star-ratings">
                            <div className="star-ratings-fill">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    );
};

export default SearchResults;