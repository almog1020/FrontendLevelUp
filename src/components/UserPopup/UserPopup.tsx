import * as React from "react";
import {UserDetails} from "./UserDetails/UserDetails.tsx";
import {useContext, useState} from "react";
import userIcon from '../../assets/user.png'
import styles from "./UserPopup.module.scss"
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";

const UserPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const user  = localStorage.getItem("user") ?? ""

    const auth = useContext(AuthContext);

    return (
        <div>
            <div className={styles.container}>
                <button onClick={() => setIsOpen(!isOpen)} className={styles.btn}>
                    <img src={userIcon} alt={"user"} />
                </button>
            </div>
            {isOpen && user && <UserDetails name={user} role={'user'} onLogout={() => auth!.logOut()}/>}
        </div>
    )
}

export default UserPopup;
