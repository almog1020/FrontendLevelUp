import Dialog from '@mui/material/Dialog';
import {useContext, useState, useEffect} from "react";
import styles from './SignIn.module.scss'
import remoteIcon from '../../assets/remote.png'
import {TextFieldSignUp} from "../TextField/TextFieldSignUp.tsx";
import {toast, ToastContainer} from "react-toastify";
import {type SubmitHandler, useForm} from 'react-hook-form';
import type {FormValues} from "../../interfaces/textField.interface.ts";
import type {SignUpFormValues} from "../../interfaces/sign.interface.ts";
import {register} from "../../services/apis/users.ts";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginButton from "./LoginButton/LoginButton.tsx";
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";
import {useDialog} from "../../contexts/DialogContext.tsx";
import {TextFieldSignIn} from "../TextField/TextFieldSignIn.tsx";

type AuthMode = 'signin' | 'signup';

export const SignIn = () => {
    const dialog = useDialog();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<AuthMode>('signin');
    
    // Sync with dialog context
    useEffect(() => {
        setOpen(dialog.isOpen);
        setMode(dialog.mode);
    }, [dialog.isOpen, dialog.mode]);
    const {register: registerSignIn, handleSubmit: handleSignInSubmit, reset: resetSignIn} = useForm<FormValues>();
    const {register: registerSignUp, handleSubmit: handleSignUpSubmit, reset: resetSignUp, watch, formState: {errors}} = useForm<SignUpFormValues>();
    const auth = useContext(AuthContext);

    const password = watch('password');

    const onSignInSubmit: SubmitHandler<FormValues> = async (data) => {
        const {email, password} = data;
        console.log(password);
        auth!.loginAction(email, password);
    };

    const onSignUpSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
        try {
            const {email, password, name} = data;
            const result = await register(email, password, name);
            if (result) {
                resetSignUp();
                dialog.closeDialog();
                toast.success('Account created successfully!');
            }
        } catch (error: unknown) {
            toast.error((error as Error).message);
        }
    };

    const handleOpen = () => {
        if (open) {
            dialog.closeDialog();
        } else {
            dialog.openDialog('signin');
            // Reset forms when opening
            resetSignIn();
            resetSignUp();
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        resetSignIn();
        resetSignUp();
    };

    const isSignIn = mode === 'signin';

    return (
        <>
            <button onClick={handleOpen} className={styles.signInButton}>Sign In</button>
            <ToastContainer/>
            <Dialog
                open={open}
                onClose={dialog.closeDialog}
                slotProps={{ paper: { className: styles.sign_in_dialog } }}>
                <button className={styles.sign_in_dialog__close} onClick={dialog.closeDialog}>✕</button>
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
                
                {isSignIn ? (
                    <form className={styles.sign_in_dialog__form} onSubmit={handleSignInSubmit(onSignInSubmit)}>
                        <TextFieldSignIn
                            title={'Email'}
                            type={'email'}
                            required={true}
                            name={'email'}
                            register={registerSignIn}
                        />
                        <TextFieldSignIn
                            title={'Password'}
                            type={'password'}
                            required={true}
                            name={'password'}
                            register={registerSignIn}
                        />
                        <div className={styles.sign_in_dialog__row}>
                            <div className={styles.sign_in_dialog__forgot}>
                                Forgot password?
                            </div>
                        </div>
                        <button className={styles.sign_in_dialog__submit} type="submit">
                            Sign In
                        </button>
                        <div className={styles.sign_in_dialog__row} style={{justifyContent: 'center', marginTop: '12px'}}>
                            <span style={{color: '#9ca3af', fontSize: '13px'}}>
                                Don't have an account?{' '}
                                <span 
                                    className={styles.sign_in_dialog__forgot}
                                    onClick={toggleMode}
                                    style={{cursor: 'pointer'}}
                                >
                                    Sign Up
                                </span>
                            </span>
                        </div>
                    </form>
                ) : (
                    <form className={styles.sign_in_dialog__form} onSubmit={handleSignUpSubmit(onSignUpSubmit)}>
                        <TextFieldSignUp
                            title={'Name'}
                            type={'text'}
                            required={true}
                            name={'name'}
                            register={registerSignUp}
                        />
                        <TextFieldSignUp
                            title={'Email'}
                            type={'email'}
                            required={true}
                            name={'email'}
                            register={registerSignUp}
                        />
                        <TextFieldSignUp
                            title={'Password'}
                            type={'password'}
                            required={true}
                            name={'password'}
                            register={registerSignUp}
                        />
                        <div className={styles.sign_in_dialog__field}>
                            <label className={styles.sign_in_dialog__label}>Confirm Password</label>
                            <input
                                className={styles.sign_in_dialog__input}
                                type="password"
                                required
                                {...registerSignUp('confirmPassword', {
                                    validate: (value) => value === password || 'Passwords do not match'
                                })}
                            />
                            {errors.confirmPassword && (
                                <span style={{color: '#ef4444', fontSize: '12px', marginTop: '4px'}}>
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>
                        <button className={styles.sign_in_dialog__submit} type="submit">
                            Sign Up
                        </button>
                        <div className={styles.sign_in_dialog__row} style={{justifyContent: 'center', marginTop: '12px'}}>
                            <span style={{color: '#9ca3af', fontSize: '13px'}}>
                                Already have an account?{' '}
                                <span 
                                    className={styles.sign_in_dialog__forgot}
                                    onClick={toggleMode}
                                    style={{cursor: 'pointer'}}
                                >
                                    Sign In
                                </span>
                            </span>
                        </div>
                    </form>
                )}

                <div className={styles.sign_in_dialog__divider}>
                    <div className={styles.sign_in_dialog__divider_line} />
                    <div className={styles.sign_in_dialog__divider_text}>
                        Or continue with
                    </div>
                    <div className={styles.sign_in_dialog__divider_line} />
                </div>

                <div className={styles.sign_in_dialog__social}>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                        <LoginButton/>
                    </GoogleOAuthProvider>
                </div>
            </Dialog>
        </>
    )
}