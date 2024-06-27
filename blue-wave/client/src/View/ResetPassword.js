import { useLocation} from 'react-router-dom';
const ResetPassword = () => {
    const location = useLocation();
    const data = location.state; // 전달받은 유저의 아이디와 이메일 정보
    const userId = data.user_id;
    const userEmail = data.user_email;
    console.log(data)
    console.log(userId)
    return(
        <div>
            <h1>비밀번호 재설정</h1>
            <h1>{userId}</h1>
            <h1>{userEmail}</h1>
        </div>
    )
}
export default ResetPassword