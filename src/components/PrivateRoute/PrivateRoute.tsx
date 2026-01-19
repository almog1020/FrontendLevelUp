
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isLogin = localStorage.getItem("user") ?? ""
    if (!isLogin) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;
