import Button from '../UI/Button';
import {Link} from 'react-router-dom';
import Header from './Header';

const CompleteRegister = () => {
    return(
        <div className="CompleteRegister">
            <Header/>
            <div style={{margin: '0 auto', padding: '58px 0 160px',width: '600px'}}>
                <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px'}}>
                    <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                </h1>
                <h1 style={{fontSize: '32px',letterSpacing: '-.48px',paddingBottom: '46px',textAlign: 'center',marginTop: '20px'}}>회원가입이 완료 되었습니다</h1>
                <div className="btn_area">
                    <Link to={"/"}>{<Button className={'meddle_btn pass_btn'} text={'메인으로 이동하기'}/>}</Link>
                    <Link to={"/login"}>{<Button className={'meddle_btn pass_btn'} text={'로그인 하기'}/>}</Link>
                </div>
            </div>
        </div>
    )
}
export default CompleteRegister;