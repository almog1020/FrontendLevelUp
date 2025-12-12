import {GoogleLogin} from "@react-oauth/google";
import {instance} from "../../../services/apis/config.ts";
import {toast} from "react-toastify";

const LoginButton = () => {
    return (
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;

                        try {
                            const res = await instance.post("/auth/google", { token });
                            toast.success("Authentication successful!");
                            console.log("Server response:", res.data);
                        } catch (error: unknown) {
                            toast.error((error as Error).message || "Authentication failed");
                        }
                    }
                }
                onError={() => {
                    toast.error("Google authentication failed");
                }}
            />
    );
};

export default LoginButton;