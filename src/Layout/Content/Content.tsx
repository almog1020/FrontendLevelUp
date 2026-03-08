import * as React from "react";
import {Route, Routes} from "react-router-dom";
import {Homepage} from "../../components/Homepage/Homepage.tsx";
import {GameDetail} from "../../components/GameDetail/GameDetail.tsx";
import UserManagement from "../../components/UserManagement/UserManagement.tsx";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.tsx";
import Profile from "../../components/Profile/Profile.tsx";
import {DialogProvider} from "../../contexts/DialogContext.tsx";
import {Catalog} from "../../components/Catalog/Catalog.tsx";
import ReviewManagement from "../../components/ReviewManagement/ReviewManagement.tsx";
import {Header} from "../../components/Header/Header.tsx";
import AdminPage from "../../components/Admin/AdminPage/AdminPage.tsx";
import PrivateRouteAdmin from "../../components/PrivateRoute/PrivateRouteAdmin/PrivateRouteAdmin.tsx";
import {Wishlist} from "../../components/Wishlist/Wishlist.tsx";

const Content: React.FC = () => {
    return (
        <>
            <Header/>
            <DialogProvider>
                <Routes>
                    <Route path={"/"} element={<Homepage/>}/>
                    <Route path={"/catalog"} element={<Catalog/>}/>
                    <Route path={"/game/:id"} element={<GameDetail/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/wishlist" element={<Wishlist/>}/>
                    </Route>
                    <Route element={<PrivateRouteAdmin/>}>
                        <Route path={"/admin/dashboard"} element={<AdminPage/>}/>
                        <Route path={"/admin/management/users"} element={<UserManagement/>}/>
                        <Route path={"/admin/management/reviews"} element={<ReviewManagement/>}/>
                    </Route>
                </Routes>
            </DialogProvider>
        </>

    )
}
export default Content;
