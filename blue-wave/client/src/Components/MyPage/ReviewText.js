import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Utils/AuthContext';
import axios from 'axios';
import "./ReviewText.css"

const ReviewText = () => {
    const [reviewData, setReviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const userId = localStorage.getItem("userId");

    const reviewsPerPage = 3;

    const fetchReviews = async (months) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST}/api/reviews?months=${months}&userId=${userId}`);
            setReviewData(response.data);
            setSelectedPeriod(months);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching review data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(0);
    }, []);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviewData.slice(indexOfFirstReview, indexOfLastReview);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>&#9733;</span>
            );
        }
        return stars;
    };

    return (
        <div className='ordersheet'>
            <div className="order_inquiry">
                <h1>나의 리뷰</h1>
            </div>
            <div className="order">
                <div className="order_list">
                    <h3>리뷰내역</h3>
                </div>
                <div className="order_table">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        currentReviews.length === 0 ? (
                            <div>리뷰내역이 없습니다</div>
                        ) : (
                           
                                <div className='reviewdiv'>
                                    {currentReviews.map(review => (
                                        <div key={review.review_id} className='review_item '>
                                            <p className='ppimg'><img className='pimg' src={review.main_image} alt="Product" style={{ width: '130px' }} /></p>
                                            <p className='pstart' id="pp">별점: {renderStars(review.star_rating)}</p>
                                            <p className='pdate' id="pp">날짜: {formatDate(review.review_date)}</p>
                                            <p className='review'> 
                                                <p className='pname' id="pp1"> {review.p_name}</p>
                                                <p className='ptitle' id="pp1">리뷰 제목:{review.title}</p>
                                                <p className='pcontent' id="pp1">리뷰 내용: {review.contents}</p>
                                        
                                            
                                            
                                            </p>
                                            
                                           
                                       </div>
                                        
                                    ))}
                                </div>
                               
                        )
                    )}
                </div>
                <div className="pagination">
                    {[...Array(Math.ceil(reviewData.length / reviewsPerPage)).keys()].map(page => (
                        <button key={page + 1} onClick={() => paginate(page + 1)}>
                            {page + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewText;