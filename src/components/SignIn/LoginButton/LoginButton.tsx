import {GoogleLogin} from "@react-oauth/google";
import {instance} from "../../../services/apis/config.ts";
import {toast} from "react-toastify";
import type {UserResponse} from "../../../interfaces/user.interface.ts";
import {useNavigate} from "react-router-dom";

const LoginButton = () => {
    const navigate = useNavigate();
    return (
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;
                        try {
                            const user:UserResponse = (await instance.post("/auth/google", { token })).data
                            localStorage.setItem("user", user.email)
                            navigate("/user");
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