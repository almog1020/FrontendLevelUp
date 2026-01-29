/**
 * Content Component
 * Main routing component that defines all application routes
 * Wraps routes with AuthProvider for authentication context
 * Uses PrivateRoute wrapper for protected routes that require authentication
 */

import * as React from "react";
import {Route, Routes} from "react-router-dom";
import {Homepage} from "../../components/Homepage/Homepage.tsx";
import {GameDetail} from "../../components/GameDetail/GameDetail.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import Profile from "../../components/Profile/Profile.tsx";
import AuthProvider from "../../components/AuthProvider/AuthProvider.tsx";
import {UserDashboard} from "../../components/UserDashboard/UserDashboard.tsx";
import {DialogProvider} from "../../contexts/DialogContext.tsx";
import ReviewManagement from "../../components/ReviewManagement/ReviewManagement.tsx"
import {Header} from "../../components/Header/Header.tsx";

const Content: React.FC = () => {
    return (
        <AuthProvider>
            <Header/>
            <DialogProvider>
                <Routes>
                    <Route path={"/"} element={<Homepage/>}/>
                    <Route path={"/game/:id"} element={<GameDetail/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path="/user/profile" element={<Profile />} />
                        <Route path="/user/dashboard" element={<UserDashboard/>}/>
                        <Route path={"/admin/management/users"} element={<UserManagement/>}/>
                        <Route path={"/admin/management/reviews"} element={<ReviewManagement/>}/>
                    </Route>
                </Routes>
            </DialogProvider>
        </AuthProvider>

    )
}
export default Content;
