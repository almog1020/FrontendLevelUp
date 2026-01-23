/**
 * Content Component
 * Main routing component that defines all application routes
 * Wraps routes with AuthProvider for authentication context
 * Uses PrivateRoute wrapper for protected routes that require authentication
 */

import * as React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import App from "../../App.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import {SignIn} from "../../components/SignIn/SignIn.tsx";
import UserPopup from "../../components/UserPopup/UserPopup.tsx";
import Profile from "../../components/Profile/Profile.tsx"; // Profile page component
import AuthProvider from "../../components/AuthProvider/AuthProvider.tsx";

const Content:React.FC = () => {
    const isLogin = localStorage.getItem("token")
    return (
        <AuthProvider>
            <Routes>
                {/* Root route: redirects to /user if logged in, otherwise shows SignIn page */}
                <Route path={"/"} element={isLogin ? <Navigate to={"/user"}/> : <App/>}/>
                
                {/* Admin user management page - accessible without PrivateRoute wrapper */}
                <Route path={"/admin/management"} element={<UserManagement/>}/>
                
                {/* Login/SignIn page */}
                <Route path={"/login"} element={<SignIn/>}/>
                {/* Protected routes - require authentication via PrivateRoute */}
                <Route element={<PrivateRoute />}>
                    {/* User dropdown/popup page */}
                    <Route path="/user" element={<UserPopup />} />
                    {/* Profile page - displays user profile information, statistics, preferences, and activities */}
                    <Route path="/user/profile" element={<Profile />} />
                </Route>
            </Routes>
        </AuthProvider>

    )
}
export default Content;