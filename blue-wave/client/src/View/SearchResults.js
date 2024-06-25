import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "./SearchResults.css"
import Header from "./Header";
import Footer from '../Components/Footer/Footer';

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
                const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
                const response = await axios.post(`http://localhost:8000/search`, { term: searchTerm }, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 헤더에 토큰 포함
                    }
                });

                if (response.data.length === 0) {
                    setNoResults(true); // 검색 결과 없음 상태 업데이트
                } else {
                    setNoResults(false); // 검색 결과 있음 상태 업데이트
                    setProducts(response.data); // 검색된 상품 상태 업데이트
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    alert('검색결과 상품이 없습니다.\n다시 검색해주세요.'); // 사용자 정의 경고 메시지 설정
                    setNoResults(true); // 검색 결과 없음 상태 업데이트
                } else if (err.response && err.response.status === 403) {
                    alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.'); // 로그인 필요 알림창
                    setNoResults(true); // 검색 결과 없음 상태 업데이트
                } else {
                    console.error('검색 결과를 가져올 수 없습니다:', err); // 에러 메시지 상태 업데이트
                    setError(err.message);
                }
            }
        };

        fetchSearchResults(); // 검색 결과 가져오는 함수 호출
    }, [searchTerm]);

    // 가격 포맷팅 함수
    const formatPrice = (price) => {
        return new Intl.NumberFormat("ko-KR").format(price);
    };

    return (
        <>
            <Header />
            <div className="search-results-container">
                <div className='fix'>
                    <p><span>'{searchTerm}'</span>에 대한 검색 결과</p>
                </div>
                {noResults && <p className="no-results">검색 결과가 없습니다.</p>}
                {error && <p className="error">{error}</p>} {/* 에러 메시지 표시 */}
                <div className="results">
                    {products.map((product) => (
                        <div key={product.product_id} className="Card">
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
            <Footer />
        </>
    );
};

export default SearchResults;
