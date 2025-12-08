import { useAuth0 } from "@auth0/auth0-react";
import googleIcon from "../../assets/google.png";
import styles from "../SignIn/SignIn.module.scss";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <button
            onClick={() => loginWithRedirect({
                authorizationParams:{
                    connection:"google-oauth2"
                }}
            )}
            className={styles.sign_in_dialog__social_btn}
        >
            <img src={googleIcon} alt={"google"}/>
        </button>
    );
};

export default LoginButton;