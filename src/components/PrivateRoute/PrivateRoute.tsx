
import { Navigate, Outlet } from "react-router-dom";
import {useCookies} from "react-cookie";
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";

const PrivateRoute = () => {
    const [cookies] = useCookies()
    const auth = useContext(AuthContext);
    if (!cookies.access_token && !auth?.user) return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRoute;
