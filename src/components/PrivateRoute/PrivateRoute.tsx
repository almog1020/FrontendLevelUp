
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    const legacyUser = localStorage.getItem("user");
    const isLogin = Boolean(token || legacyUser);
    if (!isLogin) return <Navigate to="/" replace />;
    return <Outlet />;
};

export default PrivateRoute;
