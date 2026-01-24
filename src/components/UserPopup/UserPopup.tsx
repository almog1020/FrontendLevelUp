import {UserDetails} from "./UserDetails/UserDetails.tsx";
import {useContext, useState} from "react";
import userIcon from '../../assets/user.png'
import styles from "./UserPopup.module.scss"
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import {toast} from "react-toastify";
import {logout} from "../../services/apis/users.ts";
import {googleLogout} from "@react-oauth/google";

export default function UserPopup(){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const auth = useContext(AuthContext);

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
            {isOpen && auth?.user &&
                <UserDetails
                    name={auth.user.name}
                    role={'user'}
                    onLogout={() => handelLogout(auth.user!.email,auth.user!.google_id)}
                />}
        </div>
    )
}