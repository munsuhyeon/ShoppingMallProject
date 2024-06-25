import { Component, useState } from 'react';
import Header from "./Header";
import NavBar from "../Components/MyPage/NavBar";
import UserInfo from "../Components/MyPage/UserInfo";
import Review from './Review'
import OrderSheet from './OrderSheet';
import "./MyPage.css";

const MyPage = () => {
    const [activeMenu, setActiveMenu] = useState('UserInfo'); // 활성 메뉴 상태 관리

    return(
        <div className="MyPage">
            <Header />
            <div className="wrapper">
                <NavBar activeMenu={activeMenu} onMenuClick={(menu) => setActiveMenu(menu)}/> {/* NavBar에 핸들러 전달 */}
                <main>
                    {/* activeMenu 상태에 따라 조건부 렌더링 */}
                    {activeMenu === 'UserInfo' && <UserInfo />}
                    {activeMenu === 'OrderSheet' && <OrderSheet />}
                    {activeMenu === 'Review' && <Review />} 
                </main>
            </div>
        </div>
    )
}
export default MyPage;