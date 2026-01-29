import {UserDetails} from "./UserDetails/UserDetails.tsx";
import {useContext, useEffect, useState} from "react";
import userIcon from '../../assets/user.png'
import styles from "./UserPopup.module.scss"
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import {toast} from "react-toastify";
import {getMe, logout} from "../../services/apis/users.ts";
import {googleLogout} from "@react-oauth/google";
import type {UserResponse} from "../../interfaces/user.interface.ts";

export default function UserPopup(){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const token = localStorage.getItem('token');
    const [user, setUser] = useState<UserResponse | null>(null);
    const auth = useContext(AuthContext);
    const signInAction = localStorage.getItem("signInAction") ?? "password";

    useEffect(() => {
        if (token) {
            getMe(token, signInAction)
                .then(data => setUser(data))
                .catch(err => {
                    console.error("Failed to get user:", err);
                    if (err.message.includes('Unauthorized')) {
                        toast.error(err.message);
                    }
                });
        }
    }, [token, signInAction]);

    const handelLogout = async (email:string,googleId:string) => {
        try {
            if (googleId)
                googleLogout()
            await logout(email,"inactive")
            auth?.logOut()
        }catch (error) {
            toast.error((error as Error).message);
        }
    }

    return (
        <div>
            <div className={styles.container}>
                <button onClick={() => setIsOpen(!isOpen)} className={styles.btn}>
                    <img src={userIcon} alt={"user"} />
                </button>
            </div>
            {isOpen && user &&
                <UserDetails
                    name={user.name}
                    role={user.role ?? 'user'}
                    onLogout={() => handelLogout(user.email, user.google_id ?? '')}
                />}
        </div>
    )
}