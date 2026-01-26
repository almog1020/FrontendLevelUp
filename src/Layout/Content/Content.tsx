import * as React from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import {Homepage} from "../../components/Homepage/Homepage.tsx";
import {GameDetail} from "../../components/GameDetail/GameDetail.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import {SignIn} from "../../components/SignIn/SignIn.tsx";
import AuthProvider from "../../components/AuthProvider/AuthProvider.tsx";
import {DialogProvider} from "../../contexts/DialogContext.tsx";
import AdminPage from "../../components/Admin/AdminPage/AdminPage.tsx";
import GameManagement from "../../components/Admin/GameManagement/GameManagement.tsx";
import ReviewManagement from "../../components/ReviewManagement/ReviewManagement.tsx";
import {Header} from "../../components/Header/Header.tsx";

const Content:React.FC = () => {
    return (
        <AuthProvider>
            <DialogProvider>
                <Header/>
                <Routes>
                    <Route path={"/"} element={<Homepage/>}/>
                    <Route path={"/game/:id"} element={<GameDetail/>}/>
                    <Route path={"/login"} element={<SignIn/>}/>
                    <Route path={"/admin"} element={<AdminPage />} />
                    <Route path={"/admin/games"} element={<GameManagement />} />
                    {/* Redirect /admin/management to /admin/users */}
                    <Route path={"/admin/management"} element={<Navigate to="/admin/users" replace />} />
                    {/* Protected admin routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path={"/admin/users"} element={<UserManagement/>}/>
                        <Route path={"/admin/reviews"} element={<ReviewManagement/>}/>
                        {/* Placeholder for stores - redirect to admin dashboard for now */}
                        <Route path={"/admin/stores"} element={<Navigate to="/admin" replace />} />
                    </Route>
                </Routes>
            </DialogProvider>
        </AuthProvider>

    )
}
export default Content;