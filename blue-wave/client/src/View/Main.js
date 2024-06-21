import React, { useContext } from "react";
import Header from "./Header";
import Slider from "../Components/Slider/Slider";
import RollingBanner from "../Components/RollingBanner/RollingBanner";
import Footer from "../Components/Footer/Footer";
import ProductSection from "../Components/Product1/ProductSection";
import FixedAd from "../Components/Product1/FixedAd";
import { DataProvider, DataContext } from "../Components/Product1/DataProvider";
import ProductSection2 from "../Components/Product2/ProductSection2";
import FixedAd2 from "../Components/Product2/FixedAd2";
import {
  DataProvider2,
  DataContext2,
} from "../Components/Product2/DataProvider2";
import BackToTop from "../Components/BackToTop/BackToTop";

import "./Main.css";

function AppContent() {
  const { sections = [], ads = [], loading } = useContext(DataContext);
  const {
    sections: sections2 = [],
    ads: ads2 = [],
    loading: loading2,
  } = useContext(DataContext2);

  // 섹션과 광고를 번갈아가며 렌더링
  const combinedContent = [];
  const maxLength = Math.max(sections2.length, ads2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < ads2.length) {
      combinedContent.push(<FixedAd2 key={`ad-${i}`} ad={ads2[i]} />);
    }
    if (i < sections2.length) {
      combinedContent.push(
        <ProductSection2 key={`section-${i}`} section={sections2[i]} />
      );
    }
  }

  return (
    <>
      <Header />
      <Slider />
      {/* Product1 => Product -> banner 순 */}
      {sections.map((section, index) => (
        <div key={index}>
          <ProductSection section={section} />
          {index < ads.length && <FixedAd ad={ads[index]} />}
        </div>
      ))}
      <BackToTop />
      <RollingBanner />
      {/* Product2 => Product -> banner 순 */}
      {combinedContent}
      <Footer />
    </>
  );
}

function Main() {
  return (
    <DataProvider>
      <DataProvider2>
        <div className="App">
          <AppContent />
        </div>
      </DataProvider2>
    </DataProvider>
  );
}

export default Main;
