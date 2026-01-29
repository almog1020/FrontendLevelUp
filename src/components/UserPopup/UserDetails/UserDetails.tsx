import type {UserRole} from "../../../interfaces/user.interface.ts";
import styles from './UserDetails.module.scss'
import dashboardIcon from '../../../assets/dashboard.png'
import profileIcon from '../../../assets/profile.png'
import logoutIcon from '../../../assets/logout.png'
import {useNavigate} from "react-router-dom";

export function UserDetails({name,role,onLogout,setOpen}:{name:string, role:UserRole,onLogout():void,setOpen():void}) {
    const navigate = useNavigate();
    const handleNavigate = (path:string) => {
        setOpen()
        navigate(path);
    }
    return (
        <div className={styles.user_menu}>
            <div className={styles.user_info}>
                <div className={styles.user_name}>{name.slice(0,1).toUpperCase() + name.slice(1,)}</div>
                <div className={styles.user_role}>{role}</div>
            </div>
            <div className={styles.menu_items}>
                <button className={styles.menu_item} onClick={() => handleNavigate(`/${role}/dashboard`)}>
                    <img src={dashboardIcon} alt="Dashboard" className={styles.menu_item_icon}/>
                    <div className={styles.title}>Dashboard</div>
                </button>
                <button className={styles.menu_item} onClick={() => handleNavigate(`/profile`)}>
                    <img src={profileIcon} alt="Profile" className={styles.menu_item_icon}/>
                    <div className={styles.title}>Profile</div>
                </button>
            </div>
            <button className={styles.menu_item} onClick={onLogout}>
                <img src={logoutIcon} alt="Logout" className={styles.menu_item_icon}/>
                <div className={styles.title}>Logout</div>
            </button>
        </div>
    )
}