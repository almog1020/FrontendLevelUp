import * as React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import App from "../../App.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import {SignIn} from "../../components/SignIn/SignIn.tsx";
import UserPopup from "../../components/UserPopup/UserPopup.tsx";
import AuthProvider from "../../components/AuthProvider/AuthProvider.tsx";
import {DialogProvider} from "../../contexts/DialogContext.tsx";

const Content:React.FC = () => {
    const isLogin = localStorage.getItem("token")
    return (
        <AuthProvider>
            <DialogProvider>
                <Routes>
                    <Route path={"/"} element={isLogin ? <Navigate to={"/user"}/> : <App/>}/>
                    <Route path={"/admin/management"} element={<UserManagement/>}/>
                    <Route path={"/login"} element={<SignIn/>}/>
                    <Route element={<PrivateRoute />}>
                        <Route path="/user" element={<UserPopup />} />
                    </Route>
                </Routes>
            </DialogProvider>
        </AuthProvider>

    )
}
export default Content;