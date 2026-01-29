import Dialog from '@mui/material/Dialog';
import {useState} from "react";
import styles from './SignForm.module.scss'
import remoteIcon from '../../assets/remote.png'
import LoginButton from "./LoginButton/LoginButton.tsx";
import {CircularProgress} from "@mui/material";
import {SignIn} from "./SignIn/SignIn.tsx";
import {SignUp} from "./SignUp/SignUp.tsx";


export const SignForm = () => {
    const [open, setOpen] = useState(false);
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
            <button onClick={() => setOpen(true)} className={styles.signInButton}>Sign In</button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{paper: {className: styles.sign_in_dialog}}}>
                <button className={styles.sign_in_dialog__close} onClick={() => setOpen(false)}>✕</button>
                <div className={styles.sign_in_dialog__header}>
                    <div className={styles.sign_in_dialog__icon}>
                        <img src={remoteIcon} alt={"Logo"}/>
                    </div>
                    <h2 className={styles.sign_in_dialog__title}>
                        {isSignIn ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className={styles.sign_in_dialog__subtitle}>
                        {isSignIn
                            ? 'Sign in to your account to continue'
                            : 'Sign up to get started'}
                    </p>
                </div>
                {loading ? <CircularProgress className={styles.loading}/> :
                    <div className={styles.content}>
                    {isSignIn ? <SignIn
                            loading={setLoading}
                            closeDialog={() => setOpen(false)}/> :
                        <SignUp loading={setLoading} closeDialog={() => setOpen(false)}/>
                    }
                    <div className={styles.sign_in_dialog__divider}>
                        <div className={styles.sign_in_dialog__divider_line}/>
                        <div className={styles.sign_in_dialog__divider_text}>
                            Or continue with
                        </div>
                        <div className={styles.sign_in_dialog__divider_line}/>
                    </div>
                    <div className={styles.sign_in_dialog__row} style={{justifyContent: 'center', marginTop: '12px'}}>
                        <span style={{color: '#9ca3af', fontSize: '13px'}}>
                            {!isSignIn ? "Already have account? " : "Don't have an account? "}

                            <span
                                className={styles.sign_in_dialog__forgot}
                                onClick={() => setIsSignIn(!isSignIn)}
                                style={{cursor: 'pointer'}}
                            >
                                    {!isSignIn ? "Sign In" : "Sign Up"}
                                </span>
                        </span>
                    </div>
                    <div className={styles.sign_in_dialog__social}>
                        <LoginButton loading={setLoading}/>
                    </div>
                </div>}
            </Dialog>
        </>
    )
}