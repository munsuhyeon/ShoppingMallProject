import React from "react";
import { Link } from "react-router-dom";

// FixedAd2 컴포넌트 정의
const FixedAd2 = ({ ad }) => (
  <section id={ad.id}>
    <div className="banner_item">
      <div className={`content${ad.id.slice(-1)}`}>
        {/* 광고 이미지 */}
        <img src={ad.imgSrc} alt={ad.alt} />

        {/* 광고 제목과 설명 */}
        <div className="text">
          {ad.id === "banner4" ? (
            <>
              <p>{ad.title}</p>
              <h2>{ad.description}</h2>
            </>
          ) : (
            <>
              <h2>{ad.title}</h2>
              <p>{ad.description}</p>
              {ad.pTag && <p className="p_tag">{ad.pTag}</p>}
            </>
          )}
          <Link to={ad.link}>구매하기</Link>
        </div>
      </div>
    </div>
  </section>
);

export default FixedAd2;
