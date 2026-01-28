
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isLogin = localStorage.getItem("token") ?? ""
    if (!isLogin) return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRoute;
