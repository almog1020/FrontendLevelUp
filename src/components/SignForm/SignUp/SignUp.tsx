import styles from '../SignForm.module.scss'
import {TextFieldSignUp} from "../../TextField/TextFieldSignUp.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import type {SignUpFormValues} from "../../../interfaces/sign.interface.ts";
import {register} from "../../../services/apis/users.ts";
import {toast} from "react-toastify";

export function SignUp({loading, closeDialog}: { loading(value: boolean): void, closeDialog(): void }) {
    const {
        register: registerSignUp,
        handleSubmit: handleSignUpSubmit,
        reset: resetSignUp,
        watch,
        formState: {errors}
    } = useForm<SignUpFormValues>();
    const password = watch('password');
    console.log(errors)
    const onSignUpSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
        try {
            loading(true)
            const {email, password, name} = data;
            await register(email, password, name);
            resetSignUp();
            toast.success('Account created successfully!');
            closeDialog();
        } catch (error: unknown) {
            loading(false)
            toast.error((error as Error).message);
        }
    }

    return (
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
            <div className={styles.sign_in_dialog__field}>
                <label className={styles.sign_in_dialog__label}>password</label>
                <input
                    className={styles.sign_in_dialog__input}
                    type={'password'}
                    required={true}
                    {...registerSignUp("password", {
                        minLength: { value: 8, message: "Password must be at least 8 characters." },
                        maxLength: { value: 10, message: "Password must be at most 10 characters." },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                            message: "Password must include upper, lower, number, and symbol (@$!%*?&).",
                        },
                    })}
                />
                {errors.password && (
                    <span className={styles.error}>
                                    {errors.password.message}
                    </span>)}
            </div>
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
                    <span className={styles.error}>
                                    {errors.confirmPassword.message}
                    </span>
                )}
            </div>
            <button className={styles.sign_in_dialog__submit} type="submit">
                Sign Up
            </button>
        </form>
    )
}
