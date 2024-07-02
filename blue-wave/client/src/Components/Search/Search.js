import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./Search.css";
import axios from '../../Utils/AxiosInstance.js'
import { AuthContext } from '../../Utils/AuthContext.js';

const Search = () => {
    
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [searchHistory, setSearchHistory] = useState([]); // 검색 기록 상태
    const [dropdownVisible, setDropdownVisible] = useState(false); // 드롭다운 표시 여부 상태
    const navigate = useNavigate(); // useNavigate 훅 사용
    const {userId} = useContext(AuthContext);
    const [historyLength, setHistoryLength] = useState(0); // 유저검색기록 갯수
    const inputRef = useRef(null); // input 요소에 대한 참조

    // 검색어 처리
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value); // 검색어 상태 업데이트
    };
    // 로그인한 유저의 검색기록 가져오기
    useEffect(() => {
        if(userId !== null){
                axios.get(`${process.env.REACT_APP_HOST}/api/allSearch?userId=` + userId)
                .then(response => {
                    const result = response.data.result; // 서버에서 반환한 유저 검색기록
                    setHistoryLength(result.length)
                    setSearchHistory(result)
                })
                .catch(error => {
                    alert("검색기록 조회 중 오류가 발생하였습니다");
                    console.error(error);
                });
        }
    },[userId,setSearchHistory]);

    // 검색 바에 포커스가 갔을 때 드롭다운 표시
    const handleFocus = () => {
        if (historyLength > 0) {
            setDropdownVisible(true); // 검색 기록이 있으면 드롭다운 표시
        }
    };

    // 검색 바가 포커스를 잃었을 때 드롭다운 숨기기
    const handleBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false); // 지연 후 드롭다운 숨기기
        }, 200); // 드롭다운 항목을 클릭할 시간을 주기 위한 지연
    };

    // 검색어를 DB에서 조회하는 기능 함수
    const searchDB = async (searchTerm) => {
        try{
            const res = await axios.get(`${process.env.REACT_APP_HOST}/api/search?term=` + searchTerm)
            const result = res.data.result;
            //setSearchHistory(result);
            navigate('/search', {state:{result:result,searchTerm:searchTerm}}) // 검색결과페이지로 이동 SearchResult.js
        }catch(error){
            console.log(error.message)
            if(error.response && error.response.status === 404){ // 입력한 검색결과가 없을 경우
                navigate('/search', {state: {result:"Product not found", searchTerm:searchTerm}})
            }else{
                // 다른 오류 처리
                alert("제품 검색 중 오류가 발생하였습니다")
                console.error(error)
            }
        }
    }

    // 검색 기능 폼 전송
    const handleSearch = async (event) => {
        event.preventDefault(); // 기본 폼 제출 방지
        const currentSearchTerm = searchTerm; // 현재 검색어 저장. 비동기 작업 중 상태가 변경되는 것을 방지
        if(userId !== null){
            try{
                // 1. 로그인한 유저의 검색기록 저장하기
                const updateSearch = await axios.post(`${process.env.REACT_APP_HOST}/api/search`,{userId:userId,searchTerm:searchTerm})
                if(updateSearch.status === 200){
                    // 2.입력한 검색어로 DB조회하기 + 검색결과페이지로 이동하기
                    await searchDB(currentSearchTerm);
                    // 3. 유저의 검색기록 다시 조회해서 setSearchHistory갱신 
                    axios.get(`${process.env.REACT_APP_HOST}/api/allSearch?userId=` + userId)
                    .then(response => {
                        const result = response.data.result; // 서버에서 반환한 유저 검색기록
                        setHistoryLength(result.length)
                        setSearchHistory(result)
                    })
                    .catch(error => {
                        alert("검색기록 조회 중 오류가 발생하였습니다");
                        console.error(error);
                    });
                }
            }catch(error){
                alert("검색어 저장 중 오류 발생")
                console.error(error)
            }
        }else{
            //로그인하지 않은 유저는 검색하면 결과 바로 보여주기
            await searchDB(currentSearchTerm);
        }
        setSearchTerm(''); // 검색어 입력란 초기화
        inputRef.current.blur(); // 검색 후 input 요소의 포커스 해제
    };

    // 전체 삭제
    const handleDeleteAll = async () => {
        axios.delete(`${process.env.REACT_APP_HOST}/api/allSearch?userId=` + userId)
        .then(response => {
            setSearchHistory([]); // 검색 기록 상태 초기화
            setDropdownVisible(false)
            setHistoryLength(0)
        })
        .catch(error => {
            alert("검색기록 삭제 중 오류가 발생하였습니다");
            console.error(error);
        });
    };
    // 선택한 검색어 삭제
    const handleDeleteKeyword = async (searchId) => {
        try{
            await axios.delete(`${process.env.REACT_APP_HOST}/api/search?userId=${userId}&searchId=${searchId}` )
            const updatedSearchHistory = searchHistory.filter(item => item.search_id !== searchId);
            setHistoryLength(updatedSearchHistory.length);
            setSearchHistory(updatedSearchHistory);
        }catch(error){
            alert("검색기록 삭제 중 오류가 발생하였습니다");
            console.error(error);
        }
    }

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
                    ref={inputRef}
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
                            <li key={item.search_id}  className='keyword_wrapper'>
                                <div onClick={() => searchDB(item.key_word)} className='dropdownKeyword'>{item.key_word}</div>
                                <div onClick={() => handleDeleteKeyword(item.search_id)}>
                                    <img src={`${process.env.PUBLIC_URL}/assets/close-svgrepo-com.svg`} alt="close" className='closeImg'/>
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                    <span onClick={handleDeleteAll} className='handleDeleteAll'>전체 삭제</span>
                </div>
            )}
        </div>
    );
}
export default Search