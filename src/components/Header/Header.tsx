import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Header.module.scss';
import {SignForm} from '../SignForm/SignForm.tsx';
import LevelUpLogo from '../../assets/LevelUp.png'
import UserDetails from "../UserPopup/UserDetails.tsx";
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import Action from "../General/Action/Action.tsx";
import storeIcon from '../../assets/store.png'

export const Header = () => {

        const navigate = useNavigate();
        const auth = useContext(AuthContext);

        return (
            <header className={styles.header}>
                <div className={styles.header__container}>
                    {/* Logo and Branding */}
                    <div
                        className={styles.header__logo}
                        onClick={() => {navigate('/');}}
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
                            <Action icon={storeIcon} onAction={() => navigate(`/catalog`)} label={'Catalog'} />
                        </nav>
                        {auth?.user ? <UserDetails /> : <SignForm /> }
                    </div>

                </div>
            </header>
        );
};

