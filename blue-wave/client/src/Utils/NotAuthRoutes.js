import {Outlet, Navigate} from "react-router-dom";

const NotAuthRoutes = ({loggedIn}) => {
    return(
        loggedIn ?  <Navigate to={'/'}/> : <Outlet/>
    )
}
export default NotAuthRoutes;