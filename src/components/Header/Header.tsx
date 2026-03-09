import {useNavigate} from 'react-router-dom';
import styles from './Header.module.scss';
import {SignForm} from '../SignForm/SignForm.tsx';
import LevelUpLogo from '../../assets/LevelUp.png'
import UserDetails from "../UserPopup/UserDetails.tsx";
import Action from "../General/Action/Action.tsx";
import storeIcon from '../../assets/store.png'
import {useMemo} from "react";
import {useCookies} from "react-cookie";

export const Header = () => {

    const navigate = useNavigate();
    const [cookies] = useCookies();
    const userNav = useMemo(() => {
        return cookies.access_token ? <UserDetails/> : <SignForm/>
    },[cookies])

    return (
        <header className={styles.header}>
            <div className={styles.header__container}>
                {/* Logo and Branding */}
                <div
                    className={styles.header__logo}
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <div className={styles.header__logoIcon}>
                        <img src={LevelUpLogo} alt="Level Up Logo"/>
                    </div>
                    <div className={styles.header__branding}>
                        <h1 className={styles.header__title}>LevelUp</h1>
                        <p className={styles.header__tagline}>Compare & Save</p>
                    </div>
                </div>
                {/* Right Side Actions */}
                <div className={styles.header__actions}>
                    <nav className={styles.header__nav}>
                        <Action icon={storeIcon} onAction={() => navigate(`/catalog`)} label={'Catalog'}/>
                    </nav>
                    {userNav}
                </div>

            </div>
        </header>
    );
};

