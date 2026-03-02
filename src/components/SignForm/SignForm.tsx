import Dialog from '@mui/material/Dialog';
import {useState} from "react";
import styles from './SignForm.module.scss'
import remoteIcon from '../../assets/remote.png'
import LoginButton from "./LoginButton/LoginButton.tsx";
import {CircularProgress} from "@mui/material";
import {SignIn} from "./SignIn/SignIn.tsx";
import {SignUp} from "./SignUp/SignUp.tsx";
import Action from "../General/Action/Action.tsx";
import SignInIcon from '../../assets/signIn.png'

export const SignForm = () => {
    const [open, setOpen] = useState(false);
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
            <Action icon={SignInIcon} label={'Sign In'} onAction={() => setOpen(true)}/>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{paper: {className: styles.sign_in_dialog}}}>
                <div className={styles.sign_dialog__container}>
                    <button className={styles.sign_in_dialog__close} onClick={() => setOpen(false)}>✕</button>
                    <div className={styles.sign_in_dialog__header}>
                        <div className={styles.sign_in_dialog__icon}>
                            <img src={remoteIcon} alt={"Logo"}/>
                        </div>
                        <h2 className={styles.sign_in_dialog__title}>
                            {isSignIn ? 'Welcome back' : 'Create an account'}
                        </h2>
                    </div>
                    {loading ? <div className={styles.containerLoading}>
                            <CircularProgress className={styles.loading}/>
                    </div> :
                        <div>
                            {isSignIn ? <SignIn
                                    loading={setLoading}
                                    closeDialog={() => setOpen(false)}/> :
                                <SignUp loading={setLoading} closeDialog={() => setOpen(false)}/>
                            }
                            <div className={styles.sign_in_dialog__row}>
                                <span style={{color: 'white', fontSize: '13px'}}>
                                    {!isSignIn ? "Already have account? " : "Don't have an account? "}

                                    <span
                                        onClick={() => setIsSignIn(!isSignIn)}
                                        style={{cursor: 'pointer', color: '#9d4edd'}}>
                                            {!isSignIn ? "Sign In" : "Sign Up"}
                                        </span>
                                </span>
                            </div>
                            <div className={styles.sign_in_dialog__divider}>
                                <div className={styles.sign_in_dialog__divider_line}/>
                                <div className={styles.sign_in_dialog__divider_text}>
                                    Or continue with
                                </div>
                                <div className={styles.sign_in_dialog__divider_line}/>
                            </div>
                            <div className={styles.sign_in_dialog__social}>
                                <LoginButton loading={setLoading}/>
                            </div>
                        </div>}
                </div>
            </Dialog>
        </>
    )
}