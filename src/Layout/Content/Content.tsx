import * as React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import App from "../../App.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import {SignIn} from "../../components/SignIn/SignIn.tsx";
import AuthProvider from "../../components/AuthProvider/AuthProvider.tsx";
import {UserDashboard} from "../../components/UserDashboard/UserDashboard.tsx";

const Content:React.FC = () => {
    const isLogin = localStorage.getItem("token")
    return (
        <AuthProvider>
            <Routes>
                <Route path={"/"} element={isLogin ? <Navigate to={"/user"}/> : <App/>}/>
                <Route path={"/admin/management"} element={<UserManagement/>}/>
                <Route path={"/login"} element={<SignIn/>}/>
                <Route element={<PrivateRoute />}>
                    <Route path="/user" element={<UserDashboard />} />
                </Route>
            </Routes>
        </AuthProvider>

    )
}
export default Content;