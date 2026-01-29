
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteAdmin = () => {
    const role = localStorage.getItem("role")
    if (role === "user") return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRouteAdmin;