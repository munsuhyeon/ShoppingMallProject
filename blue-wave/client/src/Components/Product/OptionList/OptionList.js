// 상세페이지 드롭다운 옵션입니다
import React, { useState, useEffect, useRef } from "react";
import "./OptionList.css";


const OptionList = ({
  // 전달받은 옵션 목록 배열
  options,
  // 선택된 옵션 상태를 관리하는 객체
  selectedOptions,
  // 옵션을 클릭했을 때 실행할 함수
  handleOptionClick,
  // 선택된 옵션 수량을 증가시키는 함수
  increaseOption,
}) => {
  



  //console.log(options);
  // 드롭다운 요소의 DOM 노드를 참조하기 위한 useRef hook
  const dropdownRef = useRef(null);
  // 드롭다운의 열림/닫힘 상태를 관리하는 상태 변수
  const [expandedOptions, setExpandedOptions] = useState(false);

  // 드롭다운을 열거나 닫는 함수
  const toggleDropdown = () => {
    setExpandedOptions(!expandedOptions); // 드롭다운 토글
  };

  // 사용자가 드롭다운 외의 영역을 클릭했을 때 드롭다운을 닫기 위한 함수
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setExpandedOptions(false);
    }
  };

  // 컴포넌트가 마운트될 때 한 번 실행되는 useEffect hook
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 옵션을 선택했을 때 실행되는 함수
  const handleSelect = (option) => {
    // 선택된 옵션이 이미 존재하는 경우
    if (selectedOptions[option]) {
      // 옵션 수량을 증가시키는 함수 호출
      increaseOption(option);
      // 선택된 옵션이 존재하지 않는 경우
    } else {
      // 옵션을 클릭했을 때 실행할 함수 호출
      handleOptionClick(option);
    }
    setExpandedOptions(false); // 선택 완료 후 드롭다운을 닫기
  };


 



  return (
    <div className="ProductOptions" ref={dropdownRef}>
      <div className="Right-Option">
        <button className="label" onClick={toggleDropdown}>
          옵션 선택
        </button>
        <ul className={`optionList ${expandedOptions ? "active" : ""}`}>
          {options.map((option) => (
            <li
              key={option}
              className="optionItem"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptionList;
