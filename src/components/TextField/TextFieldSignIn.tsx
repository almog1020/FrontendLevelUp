import styles from "../SignForm/SignForm.module.scss";
import type {ITextFieldSignIn,} from "../../interfaces/textField.interface.ts";

export const TextFieldSignIn = (textField:ITextFieldSignIn) => {
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