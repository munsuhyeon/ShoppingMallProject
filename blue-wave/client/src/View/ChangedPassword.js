import Header from "./Header"
import Button from "../UI/Button"
import { Link } from "react-router-dom"
const ChangedPassword = () => {
    return(
        <div>
            <Header/>
            <div className="ChangedPassword" style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center',height:'80vh'}}>
                <div style={{margin: '0 auto',width: '600px'}}>
                    <h1 className="logo_area" style={{textAlign: 'center', marginBottom: '15px',textAlignLast:'center'}}>
                        <img src={process.env.PUBLIC_URL + `assets/lettersLogo.png`} alt="bluewave" className="letters_logo" style={{width: '150px',height: 'auto'}}/>
                    </h1>
                    <h1 style={{fontSize: '32px',letterSpacing: '-.48px',paddingBottom: '46px',textAlign: 'center',marginTop: '20px'}}>비밀번호가 변경되었습니다</h1>
                    <Link to='/login'>
                        <div className="btn_area" style={{display:'block'}}>
                            <Button text={"로그인 하기"} className={'join_btn'} type='submit'/>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default ChangedPassword