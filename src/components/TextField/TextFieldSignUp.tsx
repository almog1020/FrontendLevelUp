import styles from "../SignForm/SignForm.module.scss";
import type {ITextFieldSignUp} from "../../interfaces/sign.interface.ts";

export const TextFieldSignUp = (textField:ITextFieldSignUp) => {
    const {title,type,required,name,register} = textField

    return (
        <div className={styles.sign_in_dialog__field}>
            <label className={styles.sign_in_dialog__label}>{title}</label>
            <input
                className={styles.sign_in_dialog__input}
                type={type}
                required={required}
                {...register(name)}
            />
        </div>
    )
}