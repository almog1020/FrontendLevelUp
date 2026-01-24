
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    // Check for token in localStorage (preferred) or user as fallback
    const isLogin = localStorage.getItem("token") ?? localStorage.getItem("user") ?? "";
    
    if (!isLogin) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;
