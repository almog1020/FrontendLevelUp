import {useContext} from "react";
import userIcon from '../../assets/user.png'
import heartIcon from '../../assets/heart.png'
import styles from "./UserDetails.module.scss"
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import {toast} from "react-toastify";
import { logout} from "../../services/apis/users.ts";
import {googleLogout} from "@react-oauth/google";
import dashboardIcon from '../../assets/dashboard.png'
import logoutIcon from '../../assets/logout.png'
import Action from "../General/Action/Action.tsx";
import {useNavigate} from "react-router-dom";


export default function UserDetails() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handelLogout = async (email?: string, googleId?: string) => {
        try {
            if (googleId)
                googleLogout()
            if (email) {
                await logout(email, "inactive")
                auth?.logout()
                toast.info("Logout successful");
                navigate("/")
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    const actions = [
        {
            label: "Logout",
            icon: logoutIcon,
            path: () => handelLogout(auth?.user?.email, auth?.user?.google_id)
        },
        {
            label: "Profile",
            icon: userIcon,
            path: () => navigate(`/profile`)
        },
        {
            label: "Wishlist",
            icon: heartIcon,
            path: () => navigate(`/wishlist`)
        },
    ]

    return (
        <div>
            <div className={styles.container}>
                {actions.map(action => <Action icon={action.icon} onAction={action.path} label={action.label}/>)}
                {auth?.user?.role === "admin" &&
                    <Action icon={dashboardIcon} onAction={() => navigate("/admin/dashboard")} label={"Dashboard"}/>}
            </div>
        </div>
    )
}
