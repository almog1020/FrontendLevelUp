import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {instance} from "../../../services/apis/config.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const LoginButton = ({loading}:{loading(value:boolean):void}) => {
    const navigate = useNavigate();
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;
                        try {
                            loading(true);
                            await instance.post("/auth/google", { token });
                            toast.success("Login successful");
                            loading(false);
                            navigate("/")
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
