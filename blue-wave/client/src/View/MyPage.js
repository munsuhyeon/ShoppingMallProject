import Header from "./Header";
import NavBar from "../Components/MyPage/NavBar";
import UserInfo from "../Components/MyPage/UserInfo";
import "./MyPage.css";

const MyPage = () => {
    return(
        <div className="MyPage">
            <Header />
            <div className="wrapper">
                <NavBar/>
                <main>
                    <UserInfo/>
                </main>
            </div>
        </div>
    )
};
export default MyPage;