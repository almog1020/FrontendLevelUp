import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {instance} from "../../../services/apis/config.ts";
import {toast} from "react-toastify";

const LoginButton = ({loading,closeDialog}:{loading(value:boolean):void,closeDialog(): void}) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;
                        try {
                            loading(true);
                            await instance.post("/auth/google", { token });
                            await new Promise((resolve) => setTimeout(resolve, 3000));
                            toast.success("Login successful");
                            loading(false);
                            closeDialog()
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
