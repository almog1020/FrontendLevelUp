import {useContext, useEffect, useState} from "react";
import userIcon from '../../assets/user.png'
import styles from "./UserDetails.module.scss"
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import {toast} from "react-toastify";
import {getMe, logout} from "../../services/apis/users.ts";
import {googleLogout} from "@react-oauth/google";
import type {UserResponse} from "../../interfaces/user.interface.ts";
import dashboardIcon from '../../assets/dashboard.png'
import logoutIcon from '../../assets/logout.png'
import Action from "../General/Action/Action.tsx";
import {useNavigate} from "react-router-dom";


export default function UserDetails() {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState<UserResponse | null>(null);
    const auth = useContext(AuthContext);
    const signInAction = localStorage.getItem("signInAction");
    const navigate = useNavigate();

    useEffect(() => {
        if (token && signInAction) {
            getMe(token, signInAction)
                .then(data => setUser(data))
                .catch(err => {
                    if (err.message.includes('Unauthorized')) {
                        toast.error(err.message);
                    }
                });
        }
    }, [token, signInAction]);

    const handelLogout = async (email: string, googleId: string) => {
        try {
            if (googleId)
                googleLogout()
            await logout(email, "inactive")
            auth?.logOut()
        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    const actions = [
        {
            label: "Logout",
            icon: logoutIcon,
            path: () => handelLogout(user!.email, user!.google_id)
        },
        {
            label: "Profile",
            icon: userIcon,
            path: () => navigate(`/profile`)
        },
    ]

    return (
        <div>
            <div className={styles.container}>
                {actions.map(action => <Action icon={action.icon} onAction={action.path} label={action.label}/>)}
                {user?.role === "admin" &&
                    <Action icon={dashboardIcon} onAction={() => navigate("/admin/dashboard")} label={"Dashboard"}/>}
            </div>
        </div>
    )
}
