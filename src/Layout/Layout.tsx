import Content from "./Content/Content.tsx";
import * as React from "react";
import {ToastContainer} from "react-toastify";
import { WishlistProvider } from "../contexts/WishlistContext";

const Layout: React.FC = () => {
    return (
        <WishlistProvider>
            <ToastContainer theme={"dark"} autoClose={5000}/>
            <Content/>
        </WishlistProvider>
    )
}
export default Layout;