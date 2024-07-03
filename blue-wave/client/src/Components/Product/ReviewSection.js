import React from "react";
import "./ReviewSection.css";
import { formatDate,createMarkup } from "../../Utils/Utils";
const ReviewSection = ({reviews}) => {

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
    <section id="Review">
      {reviews && reviews.length > 0 ?  (
        reviews.map((review, index) => (
          <div className="user" key={index}>
            <div className="userId">{review.user_id}</div> 
          <div className="reviewInfo">
            <div>{renderStars(review.star_rating)}</div>
            <div className="reviewDate">{formatDate(review.review_date)}</div>
          </div>
          <div className="title">{review.title}</div>
          <div className="context" dangerouslySetInnerHTML={createMarkup(review.contents)}></div>
          </div>
        ))
      ) : (
        <div className="noReview">등록된 상품후기가 없습니다.</div>
      )}
      
    </section>
  );
};

export default ReviewSection;