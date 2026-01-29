/**
 * UserDetails Component
 * Displays user menu dropdown with user information and navigation options
 * Shows user name, role, and provides buttons for Dashboard, Profile, and Logout
 */

import type {UserRole} from "../../../interfaces/user.interface.ts";
import {useNavigate} from "react-router-dom";
import styles from './UserDetails.module.scss'
import dashboardIcon from '../../../assets/dashboard.png'
import profileIcon from '../../../assets/profile.png'
import logoutIcon from '../../../assets/logout.png'

export function UserDetails({name,role,onLogout}:{name:string, role:UserRole,onLogout():void}) {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/user/profile');
    };

    return (
        <div className={styles.user_menu}>
            {/* User information section - displays name and role */}
            <div className={styles.user_info}>
                <div className={styles.user_name}>{name}</div>
                <div className={styles.user_role}>{role}</div>
            </div>
            
            {/* Navigation menu items */}
            <div className={styles.menu_items}>
                <button className={styles.menu_item} onClick={() => navigate(`/user/dashboard`)}>
                    <img src={dashboardIcon} alt="Dashboard" className={styles.menu_item_icon}/>
                    <div className={styles.title}>Dashboard</div>
                </button>
                
                {/* Profile button - navigates to Profile page */}
                <button className={styles.menu_item} onClick={handleProfileClick}>
                    <img src={profileIcon} alt="Profile" className={styles.menu_item_icon}/>
                    <div className={styles.title}>Profile</div>
                </button>
            </div>
            
            {/* Logout button */}
            <button className={styles.menu_item} onClick={onLogout}>
                <img src={logoutIcon} alt="Logout" className={styles.menu_item_icon}/>
                <div className={styles.title}>Logout</div>
            </button>
        </div>
    )
}
