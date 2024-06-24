import {Outlet, Navigate} from "react-router-dom";

const ProtectedRoutes = ({loggedIn}) => {
    return(
        loggedIn ? <Outlet/> : <Navigate to={'/login'}/>
    )
}
export default ProtectedRoutes;