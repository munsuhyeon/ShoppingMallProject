import React from "react";
import { Link } from "react-router-dom";

// FixedAd 컴포넌트 정의
const FixedAd = ({ ad }) => (
  <section id={ad.id}>
    <div className="banner_item">
      <div className={`content${ad.id === "banner2" ? "2" : ""}`}>
        {/* 광고 이미지 */}
        <img src={ad.imgSrc} alt={ad.alt} />

        {/* 광고 제목과 설명 */}
        <div className="text">
          <h2 dangerouslySetInnerHTML={{ __html: ad.title }}></h2>
          <p dangerouslySetInnerHTML={{ __html: ad.description }}></p>
          <Link to={ad.link}>구매하기</Link>
        </div>
      </div>
    </div>
  </section>
);

// FixedAd 컴포넌트 반환
export default FixedAd;
