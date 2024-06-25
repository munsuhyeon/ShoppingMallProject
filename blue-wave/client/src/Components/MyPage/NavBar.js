import { useContext, } from "react";
import { AuthContext } from "../../Utils/AuthContext";
import './NavBar.css'

const NavBar = ({ activeMenu, onMenuClick }) => {
    const { userName } = useContext(AuthContext);
    return(
        <div className="navBar">
            <aside>
                <nav>
                    <div className="title_area">
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="BLUE WAVE" className="mypage_logo"/>
                        <p className="mypage_title">{ userName }님</p>
                    </div>
                    <ul className="menu">
                        <li className={`nav_item ${activeMenu === 'UserInfo' ? 'active' : ''}`} onClick={() => onMenuClick('UserInfo')}>
                            <a className="nav_link">개인정보 수정</a>
                        </li>
                        <li className={`nav_item ${activeMenu === 'OrderSheet' ? 'active' : ''}`} onClick={() => onMenuClick('OrderSheet')}>
                            <a className="nav_link">주문내역</a>
                        </li>
                        <li className={`nav_item ${activeMenu === 'Review' ? 'active' : ''}`} onClick={() => onMenuClick('Review')}>
                            <a className="nav_link">상품후기</a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}
export default NavBar