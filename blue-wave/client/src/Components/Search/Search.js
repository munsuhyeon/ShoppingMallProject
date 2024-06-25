import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./Search.css";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [searchHistory, setSearchHistory] = useState([]); // 검색 기록 상태
    const [error, setError] = useState(null); // 에러 메시지 상태
    const [dropdownVisible, setDropdownVisible] = useState(false); // 드롭다운 표시 여부 상태
    const [noResults, setNoResults] = useState(false); // 검색 결과 없음 상태
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchSearchHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/search`);
                console.log('Fetched search history:', response.data); // 데이터를 제대로 받아오는지 확인
                setSearchHistory(response.data); // 검색 기록 상태 업데이트
            } catch (err) {
                console.error('검색 기록을 가져올 수 없습니다:', err); // 에러 메시지 상태 업데이트
                setError(err.message);
            }
        };

        fetchSearchHistory(); // 검색 기록 가져오는 함수 호출
    }, []);

    // 검색어 처리
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value); // 검색어 상태 업데이트
    };

    // 검색 처리
    const handleSearch = async (event) => {
        event.preventDefault(); // 기본 폼 제출 방지
        try {
            // 1. 검색어 삽입 및 상품 조회
            const response = await axios.post(`http://localhost:8000/search`, { term: searchTerm });
            
            if (response.data.length === 0) {
                alert('검색결과 상품이 없습니다.\n다시검색해주세요.'); // 사용자 정의 경고 메시지 설정
                setNoResults(true); // 검색 결과 없음 상태 업데이트
            } else {
                setNoResults(false); // 검색 결과 있음 상태 업데이트
                setSearchTerm(''); // 검색어 입력란 초기화
                const historyResponse = await axios.get(`http://localhost:8000/search`); // 업데이트 내용 가져오기
                setSearchHistory(historyResponse.data); // 검색 기록 상태 업데이트
                navigate(`/search?query=${searchTerm}`);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('검색결과 상품이 없습니다.\n다시검색해주세요.'); // 사용자 정의 경고 메시지 설정
                setNoResults(true); // 검색 결과 없음 상태 업데이트
            } else {
                console.error('검색 중 오류 발생:', err); // 에러 메시지 상태 업데이트
                setError(err.message);
            }
        }
    };

    // 검색 기록 클릭 시 처리
    const handleSearchHistoryClick = async (term) => {
        try {
            const response = await axios.post(`http://localhost:8000/search`, { term });
            
            if (response.data.length === 0) {
                alert('검색결과 상품이 없습니다.\n다시검색해주세요.'); // 사용자 정의 경고 메시지 설정
                setNoResults(true); // 검색 결과 없음 상태 업데이트
            } else {
                setNoResults(false); // 검색 결과 있음 상태 업데이트
                navigate(`/search?query=${term}`);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('검색결과 상품이 없습니다.\n다시검색해주세요.'); // 사용자 정의 경고 메시지 설정
                setNoResults(true); // 검색 결과 없음 상태 업데이트
            } else {
                console.error('검색 중 오류 발생:', err); // 에러 메시지 상태 업데이트
                setError(err.message);
            }
        }
    };

    // 전체 삭제
    const handleDeleteAll = async () => {
        try {
            await axios.delete(`http://localhost:8000/search`); // 모든 검색 기록 삭제
            setSearchHistory([]); // 검색 기록 상태 초기화
        } catch (err) {
            console.error('전체 삭제 오류:', err); // 에러 메시지 상태 업데이트
            setError(err.message);
        }
    };

    // 검색 바에 포커스가 갔을 때 드롭다운 표시
    const handleFocus = () => {
        if (searchHistory.length > 0) {
            setDropdownVisible(true); // 검색 기록이 있으면 드롭다운 표시
        }
    };

    // 검색 바가 포커스를 잃었을 때 드롭다운 숨기기
    const handleBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false); // 지연 후 드롭다운 숨기기
        }, 200); // 드롭다운 항목을 클릭할 시간을 주기 위한 지연
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-box"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="찾고 싶은 상품을 검색해보세요!"
                />
                <button type="submit">
                    <FaSearch />
                </button>
            </form>
            {dropdownVisible && (
                <div className="search_dropdown">
                    <h3>최근검색어</h3>
                    <ul>
                        {searchHistory.map((item) => (
                            <li key={item.search_id} onClick={() => handleSearchHistoryClick(item.key_word)}>
                                <span>{item.key_word}</span>
                            </li>
                        ))}
                    </ul>
                    <span onClick={handleDeleteAll}>전체 삭제</span>
                </div>
            )}
            {error && <p className="error">{error}</p>} {}
        </div>
    );
};

export default Search;
