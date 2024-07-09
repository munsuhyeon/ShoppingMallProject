import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// 데이터를 저장할 컨텍스트 생성
const DataContext2 = createContext();

const DataProvider2 = ({ children }) => {
  // 상태 값 설정
  const [sections, setSections] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect를 사용하여 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출로 데이터를 가져옴
        const response = await axios.get(`${process.env.REACT_APP_HOST}/shop`);
        const data = response.data;

        // 섹션 데이터 초기값 설정
        const sectionsData = [
          {
            title: "👟 스포츠",
            subtitle: "편안한 착용감과 뛰어난 성능을 제공하는 스포츠 용품",
            moreLink: "/product/3",
            products: [],
          },
          {
            title: "📚 도서",
            subtitle:
              "BLUE WAVE에서는 감동적인 이야기부터 다채로움 즐거움까지 가질 수 있는 기회!",
            moreLink: "/product/4/6",
            products: [],
          },
          {
            title: "📐 사무용품",
            subtitle: "효율적인 업무를 위한 최적의 사무용품",
            moreLink: "/product/5/7",
            products: [],
          },
          {
            title: "🐕‍🦺 반려동물 용품",
            subtitle: "편안함과 안전성을 고려한 반려동물 용품",
            moreLink: "/product/6/8",
            products: [],
          },
        ];

        // 데이터베이스에서 가져온 데이터를 섹션에 매핑
        data.forEach((product) => {
          const validCategoryIds = [3, 4, 5, 6];
          if (validCategoryIds.includes(product.category_id)) {
            const categoryIndex = validCategoryIds.findIndex(
              (categoryId) => categoryId === product.category_id
            );
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

        setSections(sectionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const adsData = [
    {
      id: "banner3",
      imgSrc: "assets/banner/하이큐3.png",
      alt: "도서",
      title: "[만화] 하이큐 세트 판매 중!",
      description: "흥미진진한 배구 경기와 감동적인 성장물로 만든 스포츠 만화!",
      pTag: "#배구 #성장물 #스포츠 #완결",
      link: "/product/4/6",
    },
    {
      id: "banner4",
      imgSrc: "assets/banner/삼색볼펜4.png",
      alt: "사무용품",
      title: "부드러움 필기감을 원한다면?",
      description: "제브라 삼색 볼펜을 사용해보세요!",
      link: "/product/5/7",
    },
    {
      id: "banner5",
      imgSrc: "assets/banner/나이키5.png",
      alt: "나이키",
      title: '"활동성과 편안함을 필수인 그들에게"',
      description: "여름 특가 이월 상품 최대 50%",
      link: "/product/3",
    },
  ];

  const contextValue = {
    sections,
    ads: adsData,
    loading,
  };

  return (
    <DataContext2.Provider value={contextValue}>
      {children}
    </DataContext2.Provider>
  );
};

export { DataProvider2, DataContext2 };
