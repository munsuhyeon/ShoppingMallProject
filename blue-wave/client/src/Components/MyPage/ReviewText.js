import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "./ReviewText.css"
import { createMarkup } from '../../Utils/Utils';

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
                                        <div key={review.review_id} className='review_item'>
                                            <div className='product_title'>{review.p_name}</div>
                                            <div className='review_area'>
                                            <div className='review_info'>
                                                <div><img className='pimg' src={review.main_image} alt="Product" /></div>
                                                <div className='star_area'>{renderStars(review.star_rating)}</div>
                                                <div className='review_date'>{formatDate(review.review_date)}</div>
                                            </div>
                                            <div className='review_content'>
                                                <div className='review_title'>{review.title}</div>
                                                <div className='review_content' dangerouslySetInnerHTML={createMarkup(review.contents)}></div>
                                            </div>
                                            </div>
                                            
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