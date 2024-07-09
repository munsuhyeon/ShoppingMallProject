import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출로 데이터를 가져옴
        const response = await axios.get(`${process.env.REACT_APP_HOST}/shop`);
        const data = response.data;

        // 섹션 데이터 초기값 설정
        const sectionsData = [
          {
            title: "인테리어",
            subtitle: "모던한 감각과 실용성을 겸비한 인테리어.",
            // moreLink는 '더보기' (더 보기 클릭 -> 카테고리 상세페이지 이동 )을 의미
            moreLink: "/product/1", //주소 수정
            products: [],
          },
          {
            title: "📺 디지털",
            subtitle: "편리하고 스마트한 디지털 라이프를 위한 필수품",
            moreLink: "/product/2/3",
            products: [],
          },
        ];

        // 데이터베이스에서 가져온 데이터를 섹션에 매핑
        data.forEach((product) => {
          // 여러 카테고리 ID를 처리하기 위한 배열 정의
          const validCategoryIds = [1, 2]; // 예시로 3과 4를 포함하는 경우

          // product의 카테고리 ID가 validCategoryIds 배열에 포함되어 있는지 확인
          if (validCategoryIds.includes(product.category_id)) {
            // 해당 product의 카테고리 ID가 validCategoryIds 배열에서 몇 번째 위치에 있는지 찾기
            const categoryIndex = validCategoryIds.findIndex(
              (categoryId) => categoryId === product.category_id
            );

            // 찾은 인덱스로 sectionsData에 접근하여 product를 추가
            if (categoryIndex !== -1) {
              sectionsData[categoryIndex].products.push({
                id: product.product_id, // id 값을 포함
                name: product.p_name,
                content: product.p_description,
                description: "무료배송",
                price: product.p_price,
                imgSrc: product.main_image,
                categoryId: product.category_id,
                subCategoryId: product.sub_category_id,
              });
            }
          }
        });

        // 섹션 데이터 상태 설정
        setSections(sectionsData);

        // 광고 데이터 첨부 (banner 데이터)
        const adsData = [
          {
            id: "banner",
            imgSrc: "assets/banner/디지털1.png",
            alt: "전자제품 광고",
            title: "가전은 역시 <span>LG</span>",
            description:
              'BLUE WAVE 구매 고객님께만 드리는 <br /> <span class="p1_1"> 최대 20% + 5% 추가 혜택</span>',
            link: "/product/2/3",
          },
          {
            id: "banner2",
            imgSrc: "assets/banner/인테리어1.png",
            alt: "디지털 카메라",
            title: "깔끔하고 모던한 인테리어",
            description: "",
            link: "/product/1",
          },
        ];

        setAds(adsData);
        setLoading(false);
      } catch (error) {
        console.error("상품 데이터를 가져오는 중 에러 발생:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ sections, ads, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataProvider, DataContext };
