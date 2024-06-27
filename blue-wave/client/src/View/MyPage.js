import { useState,useEffect } from 'react';
import { useLocation,useNavigate   } from 'react-router-dom';
import Header from "./Header";
import NavBar from "../Components/MyPage/NavBar";
import UserInfo from "../Components/MyPage/UserInfo";
import ReviewText from '../Components/MyPage/ReviewText'
import OrderSheet from '../Components/MyPage/OrderSheet';
import "./MyPage.css";

const MyPage = () => {
    const location = useLocation();
    const navigate  = useNavigate ();
    const queryParams = new URLSearchParams(location.search);

    const initialMenu = queryParams.get('menu') || 'UserInfo';

    const [activeMenu, setActiveMenu] = useState(initialMenu); 

    useEffect(() => {
        const menu = queryParams.get('menu');
        if (menu && menu !== activeMenu) {
            setActiveMenu(menu);
        }
    }, [location.search]);

    useEffect(() => {
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.set('menu', activeMenu);
        navigate(`?${newQueryParams.toString()}`, { replace: true });
    }, [activeMenu, navigate]);

    return(
        <div className="MyPage">
            <Header />
            <div className="wrapper">
                <NavBar activeMenu={activeMenu} onMenuClick={(menu) => setActiveMenu(menu)}/> {/* NavBar에 핸들러 전달 */}
                <main>
                    {/* activeMenu 상태에 따라 조건부 렌더링 */}
                    {activeMenu === 'UserInfo' && <UserInfo />}
                    {activeMenu === 'OrderSheet' && <OrderSheet />}
                    {activeMenu === 'Review' && <ReviewText/>} 
                </main>
            </div>
        </div>
    )
}
export default MyPage;