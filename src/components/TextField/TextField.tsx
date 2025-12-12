import styles from "../SignIn/SignIn.module.scss";
import type {ITextField} from "../../interfaces/textField.interface.ts";
import type {FieldValues} from "react-hook-form";

export const TextField = <T extends FieldValues>(textField:ITextField<T>) => {
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