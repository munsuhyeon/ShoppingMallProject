// 페이지네이션입니다.
import React from "react";
import PropTypes from "prop-types";
import "./Pagination.css"; // 필요한 CSS 파일

const Pagination = ({
  // 현재 페이지 번호
  currentPage,
  // 전체 페이지 수
  totalPages,
  // 표시할 페이지 번호 수
  pagesToShow,
  // 페이지 클릭 이벤트 핸들러
  handlePageClick,
}) => {
  // 페이지 번호를 담을 배열을 초기화합니다.
  const pageNumbers = [];
  // 페이지 번호를 계산하여 배열에 추가합니다.
  for (
    let i = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    i <= Math.min(totalPages, currentPage + Math.floor(pagesToShow / 2));
    i++
  ) {
    // 각 페이지 번호에 대한 링크를 생성하고 클릭 이벤트를 처리합니다.
    pageNumbers.push(
      <a
        // React에서 요소에 고유한 키를 지정합니다.
        key={i}
        // 현재 페이지면 'active' 클래스를 추가합니다.
        className={i === currentPage ? "active" : ""}
        href="#"
        onClick={(e) => {
          // 기본 링크 동작 방지
          e.preventDefault();
          // 페이지 클릭 이벤트 핸들러 호출
          handlePageClick(i);
        }}
      >
        {i}
      </a>
    );
  }

  return (
    <div className="pagination">
      {/* 이전 페이지로 이동하는 버튼 */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          // 이전 페이지 클릭 이벤트 핸들러 호출
          handlePageClick(currentPage - 1);
        }}
      >
        {/* 이전 화살표 텍스트 */}
        &lt;
      </a>
      {/* 페이지 번호 목록 */}
      {pageNumbers}
      {/* 다음 페이지로 이동하는 버튼 */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          // 다음 페이지 클릭 이벤트 핸들러 호출
          handlePageClick(currentPage + 1);
        }}
      >
        {/* 다음 화살표 텍스트 */}
        &gt;
      </a>
    </div>
  );
};
// prop-types를 사용하여 props의 타입을 검사합니다.
Pagination.propTypes = {
  // 현재 페이지 번호는 반드시 숫자형이어야 합니다.
  currentPage: PropTypes.number.isRequired,
  // 전체 페이지 수는 반드시 숫자형이어야 합니다.
  totalPages: PropTypes.number.isRequired,
  // 표시할 페이지 번호 수는 반드시 숫자형이어야 합니다.
  pagesToShow: PropTypes.number.isRequired,
  // 페이지 클릭 이벤트 핸들러는 반드시 함수형이어야 합니다.
  handlePageClick: PropTypes.func.isRequired,
};

export default Pagination;
