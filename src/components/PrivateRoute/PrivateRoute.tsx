
import { Navigate, Outlet } from "react-router-dom";
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import {useContext} from 'react';
const PrivateRoute = () => {
    const auth = useContext(AuthContext);
    if (!auth?.user) return <Navigate to="/" />;
    return <Outlet />;
};

export default PrivateRoute;
