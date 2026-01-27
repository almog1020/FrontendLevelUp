import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {instance} from "../../../services/apis/config.ts";
import {toast} from "react-toastify";
import {useContext} from "react";
import {AuthContext} from "../../AuthProvider/AuthProvider.tsx";

const LoginButton = ({loading}:{loading(value:boolean):void}) => {
    const auth = useContext(AuthContext);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;
                        try {
                            loading(true);
                            await instance.post("/auth/google", { token })
                            auth!.loginAction(token!,"google");
                        } catch (error: unknown) {
                            loading(false);
                            toast.error((error as Error).message || "Authentication failed");
                        }
                    }
                }
                onError={() => {
                    loading(false);
                    toast.error("Google authentication failed");
                }}
            />
        </GoogleOAuthProvider>
    );
};

export default LoginButton;
