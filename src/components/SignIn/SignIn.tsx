import Dialog from '@mui/material/Dialog';
import {useState} from "react";
import styles from './SignIn.module.scss'
import remoteIcon from '../../assets/remote.png'
import {TextField} from "../TextField/TextField.tsx";
import {toast, ToastContainer} from "react-toastify";
import {type SubmitHandler, useForm} from 'react-hook-form';
import type {FormValues} from "../../interfaces/textField.interface.ts";
import {login} from "../../services/apis/users.ts";
import LoginButton from "../LoginButton/LoginButton.tsx";



export const SignIn = () => {
    const [open, setOpen] = useState(false);
    const {register,handleSubmit,reset} = useForm<FormValues>()
    const onSubmit:SubmitHandler<FormValues> = async (data) => {
        try {
            const {email,password} = data
            const result = await login(email, password)
            if (!result) {
                toast.error('The user doesnt found')
            }
            else {
                reset()
                handleOpen()
            }
        }catch (error:unknown) {
            toast.error((error as Error).message);
        }
    }
    const handleOpen = () => {
        setOpen(!open);
    }
    return (
        <>
            <button onClick={handleOpen} className={styles.signInButton}>Sign In</button>
            <ToastContainer/>
            <Dialog
                open={open}
                onClose={handleOpen}
                slotProps={{ paper: { className: styles.sign_in_dialog } }}>
                <button className={styles.sign_in_dialog__close} onClick={handleOpen}>✕</button>
                <div className={styles.sign_in_dialog__header}>
                    <div className={styles.sign_in_dialog__icon}>
                        <img src={remoteIcon} alt={"Logo"}/>
                    </div>
                    <h2 className={styles.sign_in_dialog__title}>Welcome back</h2>
                    <p className={styles.sign_in_dialog__subtitle}>
                        Sign in to your account to continue
                    </p>
                </div>
                <form className={styles.sign_in_dialog__form} onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        title={'Email'}
                        type={'email'}
                        required={true}
                        name={'email'}
                        register={register}
                    />
                    <TextField
                        title={'Password'}
                        type={'password'}
                        required={true}
                        name={'password'}
                        register={register}
                    />

                    <div className={styles.sign_in_dialog__row}>
                        <div className={styles.sign_in_dialog__forgot}>
                            Forgot password?
                        </div>
                    </div>
                    <button className={styles.sign_in_dialog__submit} type="submit">
                        Sign In
                    </button>
                </form>

                <div className={styles.sign_in_dialog__divider}>
                    <div className={styles.sign_in_dialog__divider_line} />
                    <div className={styles.sign_in_dialog__divider_text}>
                        Or continue with
                    </div>
                    <div className={styles.sign_in_dialog__divider_line} />
                </div>

                <div className={styles.sign_in_dialog__social}>
                    <LoginButton/>
                </div>
            </Dialog>
        </>
    )
}