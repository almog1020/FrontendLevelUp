
import { Navigate, Outlet } from "react-router-dom";
import {useCookies} from "react-cookie";
const PrivateRoute = () => {
    const [cookies] = useCookies()
    if (!cookies.access_token) return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRoute;
