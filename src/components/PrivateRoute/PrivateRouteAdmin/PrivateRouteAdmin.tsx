
import { Navigate, Outlet } from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../AuthProvider/AuthProvider.tsx";

const PrivateRouteAdmin = () => {
    const auth = useContext(AuthContext);
    if (auth?.user?.role === "user") return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRouteAdmin;