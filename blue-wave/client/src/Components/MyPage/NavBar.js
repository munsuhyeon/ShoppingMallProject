import './NavBar.css'
const NavBar = () => {
    return(
        <div className="navBar">
            <aside>
                <nav>
                    <div className="title_area">
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="BLUE WAVE" className="mypage_logo"/>
                        <p className="mypage_title">홍길동님</p>
                    </div>
                    <ul className="menu">
                        <li className="nav_item active">
                            <a className="nav_link">개인정보 수정</a>
                        </li>
                        <li className="nav_item">
                            <a className="nav_link">주문내역</a>
                        </li>
                        <li className="nav_item">
                            <a className="nav_link">장바구니</a>
                        </li>
                        <li className="nav_item">
                            <a className="nav_link">상품후기</a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}
export default NavBar