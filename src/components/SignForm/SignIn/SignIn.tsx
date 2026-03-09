import {type SubmitHandler, useForm} from "react-hook-form";
import type {FormValues} from "../../../interfaces/textField.interface.ts";
import {TextFieldSignIn} from "../../TextField/TextFieldSignIn.tsx";
import {login} from "../../../services/apis/users.ts";
import {toast} from "react-toastify";
import styles from '../SignForm.module.scss'

export function SignIn({loading, closeDialog}: { loading(value: boolean): void, closeDialog(): void }) {
    const {
        register: registerSignIn,
        handleSubmit: handleSignInSubmit,
        reset: resetSignIn,
    } = useForm<FormValues>();

    const onSignInSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            loading(true)
            const {email, password} = data;
            await login(email, password);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            toast.success("Login successful");
            loading(false);
            resetSignIn();
            closeDialog();
        } catch (error: unknown) {
            loading(false)
            toast.error((error as Error).message || 'Login failed');
        }
    };

    return (
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
            <button className={styles.sign_in_dialog__submit} type="submit">
                Sign In
            </button>
        </form>
    )
}