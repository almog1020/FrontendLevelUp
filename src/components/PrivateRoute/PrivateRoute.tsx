
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    // Check for token in localStorage
    let isLogin = localStorage.getItem("token") ?? "";
    
    if (!isLogin) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;
