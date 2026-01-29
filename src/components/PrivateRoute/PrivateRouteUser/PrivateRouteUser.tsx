
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteUser = () => {
    const role = localStorage.getItem("role") ?? ""
    if (role === "admin") return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRouteUser;