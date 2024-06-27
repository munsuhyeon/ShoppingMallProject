import Header from "./Header"
import Button from "../UI/Button"
import { Link, useLocation } from "react-router-dom"

const FindIdResult = () => {
    const location = useLocation();
    const {userId} = location.state;
    return(
        <div className="FindIdResult">
            <Header/>
            <div style={{margin: '0 auto', padding: '58px 0 160px',width: '600px'}}>
                <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px'}}>
                    <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                </h1>
                <h1 style={{fontSize: '32px',letterSpacing: '-.48px',paddingBottom: '46px',textAlign: 'center',marginTop: '20px'}}>아이디 찾기</h1>
                <p className="find_id_txt" style={{textAlign:'center',fontSize:'20px',paddingBottom:'30px'}}>회원가입 시 사용한 아이디는 <span style={{fontWeight:'bold'}}>{userId}</span> 입니다</p>
                <div className="btn_area">
                    <Link to={"/login"}>{<Button className={'meddle_btn pass_btn'} text={'로그인 하기'}/>}</Link>
                    <Link to={"/findPassword"}>{<Button className={'meddle_btn pass_btn'} text={'비밀번호 찾기'}/>}</Link>
                </div>
            </div>
        </div>
    )
}
export default FindIdResult