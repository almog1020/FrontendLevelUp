import Content from "./Content/Content.tsx";
import * as React from "react";
import {ToastContainer} from "react-toastify";

const Layout: React.FC = () => {
    return (
        <>
            <ToastContainer theme={"dark"} autoClose={5000}/>
            <Content/>
        </>
    )
}
export default Layout;