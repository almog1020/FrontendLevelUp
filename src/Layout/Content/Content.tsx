import * as React from "react";
import {Route, Routes} from "react-router-dom";
import {Homepage} from "../../components/Homepage/Homepage.tsx";
import {GameDetail} from "../../components/GameDetail/GameDetail.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import {SignIn} from "../../components/SignIn/SignIn.tsx";
import UserPopup from "../../components/UserPopup/UserPopup.tsx";
import AuthProvider from "../../components/AuthProvider/AuthProvider.tsx";
import {DialogProvider} from "../../contexts/DialogContext.tsx";

const Content:React.FC = () => {
    return (
        <AuthProvider>
            <DialogProvider>
                <Routes>
                    <Route path={"/"} element={<Homepage/>}/>
                    <Route path={"/game/:id"} element={<GameDetail/>}/>
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