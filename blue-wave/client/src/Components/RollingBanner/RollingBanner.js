import React, { useEffect } from "react";
import "./RollingBanner.css";

const RollingBanner = () => {
  useEffect(() => {
    const roller = document.querySelector(".rolling-list");
    roller.id = "roller1"; // 아이디 부여

    const clone = roller.cloneNode(true);
    clone.id = "roller2";
    document.querySelector(".wrap").appendChild(clone); // wrap 하위 자식으로 부착

    document.querySelector("#roller1").style.left = "0px";
    document.querySelector("#roller2").style.left = `${
      document.querySelector(".rolling-list ul").offsetWidth
    }px`;

    roller.classList.add("original");
    clone.classList.add("clone");
  }, []);

  return (
    <section id="rolling">
      <div className="wrap">
        {/* 배너 표시 영역 */}
        <div className="rolling-list">
          {/* 원본 배너 */}
          <ul>
            <li>
              <div className="image-wrap">
                <img src="assets/rolling_banner/인테리어.png" alt="인테리어" />
              </div>
              <div className="desc">
                <strong>인테리어</strong>
                <span>
                  우리의 집을 따뜻하고 세련된 공간으로 만들어주는 인테리어
                  솔루션. 풍부한 디자인과 다양한 스타일로 여러분의 가정을 더욱
                  아름답게 꾸며보세요.
                </span>
              </div>
            </li>
            <li>
              <div className="image-wrap">
                <img src="assets/rolling_banner/디지털.png" alt="디지털" />
              </div>
              <div className="desc">
                <strong>디지털</strong>
                <span>
                  현대 사회에서 필수적인 디지털 기기부터 최신 기술의
                  전자제품까지, 생활을 더욱 편리하게 만들어주는 디지털 솔루션.
                  삶의 편의를 높이고 새로운 경험을 만나보세요.
                </span>
              </div>
            </li>
            <li>
              <div className="image-wrap">
                <img src="assets/rolling_banner/스포츠.png" alt="스포츠" />
              </div>
              <div className="desc">
                <strong>스포츠</strong>
                <span>
                  건강하고 활기찬 라이프스타일을 위한 스포츠 의류와 트렌디한
                  스포츠 웨어를 제공합니다. 트렌디한 스타일과 탁월한 기능성으로
                  즐거운 운동을 경험해보세요.
                </span>
              </div>
            </li>
            <li>
              <div className="image-wrap">
                <img src="assets/rolling_banner/도서.png" alt="도서" />
              </div>
              <div className="desc">
                <strong>도서</strong>
                <span>
                  애니메이션은 하이큐, 원피스, 네이버 웹툰 만화 등 소소한
                  행복감을 줄 수 있다. 또한, 푸바오의 서적은 지혜와 인생의
                  교훈을 담아내어, 우리에게 영감을 주는 소중한 동반자가 될
                  것입니다.
                </span>
              </div>
            </li>
            <li>
              <div className="image-wrap">
                <img src="assets/rolling_banner/사무용품.png" alt="사무용품" />
              </div>
              <div className="desc">
                <strong>사무용품</strong>
                <span>
                  깔끔하고 정확한 필기와 저렴하게 구매하고 싶은 신분들은 지금
                  바로 BLUEWAVE에서 구매하세요.
                </span>
              </div>
            </li>
            <li>
              <div className="image-wrap">
                <img src="assets/rolling_banner/반려동물.png" alt="반려동물" />
              </div>
              <div className="desc">
                <strong>반려동물 용품</strong>
                <span>
                  사랑스럽고 건강한 반려동물을 위한 다양한 용품을 제공합니다.
                  친구와 함께 보내는 행복한 일상을 만들어보세요.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RollingBanner;
