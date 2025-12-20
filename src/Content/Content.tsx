import * as React from "react";
import {Route, Routes} from "react-router-dom";
import App from "../App.tsx";
import UserManagement from "../components/UserManagement/UserManagement.tsx";

const Content:React.FC = () => {
    return (
        <Routes>
            <Route path={"/"} element={<App/>}/>
            <Route path={"/admin/management"} element={<UserManagement/>}/>
        </Routes>
    )
}
export default Content;