import * as React from "react";
import {Route, Routes} from "react-router-dom";
import App from "../App.tsx";
import UserManagement from "../components/UserManagement/UserManagement.tsx";
import AdminPage from "../components/Admin/AdminPage/AdminPage.tsx";
import GameManagement from "../components/Admin/GameManagement/GameManagement.tsx";
// import StoreManagement from "../components/Admin/StoreManagement/StoreManagement.tsx";
// import ReviewModeration from "../components/Admin/ReviewModeration/ReviewModeration.tsx";

const StoreManagementPlaceholder = () => (
  <div style={{ padding: 16 }}>
    <h2>Store Management</h2>
    <p>Coming soon</p>
  </div>
);

const ReviewModerationPlaceholder = () => (
  <div style={{ padding: 16 }}>
    <h2>Review Moderation</h2>
    <p>Coming soon</p>
  </div>
);

const Content:React.FC = () => {
    return (
        <Routes>
            <Route path={"/"} element={<App/>}/>
            <Route path={"/admin/management"} element={<UserManagement/>}/>

            {/* NEW routes */}
            <Route path={"/admin"} element={<AdminPage />} />
            <Route path={"/admin/games"} element={<GameManagement />} />
            <Route path={"/admin/stores"} element={<StoreManagementPlaceholder />} />
            <Route path={"/admin/reviews"} element={<ReviewModerationPlaceholder />} />
        </Routes>
    )
}
export default Content;