import "./Header.css"
const Header = () => {
    return(
        <div className="Header">
            <header>

        <div className="container">
          <div className="logo">
            <a href="#"
              ><img src={process.env.PUBLIC_URL + `assets/mainLogo.png`} alt="bluewave_logo"
            /></a>
          </div>

          <div>
            <div className="nav_top">
              <ul className="nav_top_menu">
                <li><a href="로그인.html">로그인</a></li>
                <li><a href="회원가입.html">회원가입</a></li>
                <li>
                  <a href="">
                    <i className="fa-solid fa-user"></i>
                  </a>
                </li>
                <li>
                  <a href=""><i className="fa-solid fa-cart-shopping"></i></a>
                </li>
              </ul>
            </div>
  

            <div className="search-bar">
              <input type="text" placeholder="찾고 싶은 상품 검색해보세요!" />
              <button type="button">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </div>

        <nav className="nav_bar">
          <div className="container">
            <ul className="nav_menu">
              <li><a href="">홈인테리어</a></li>
              <li><a href="">가전디지털</a></li>
              <li><a href="">스포츠/레저</a></li>
              <li><a href="">서적</a></li>
              <li><a href="">문구/완구</a></li>
              <li><a href="">반려동물용품</a></li>
            </ul>
          </div>
        </nav>
      </header>
        </div>
    )
}
export default Header;