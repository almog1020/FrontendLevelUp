import {GoogleLogin} from "@react-oauth/google";
import {instance} from "../../../services/apis/config.ts";
import {toast} from "react-toastify";
import type {UserResponse} from "../../../interfaces/user.interface.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

const LoginButton = () => {
    const navigate = useNavigate();
    return (
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;
                        try {
                            const user:UserResponse = (await instance.post("/auth/google", { token })).data
                            localStorage.setItem("user", user.name)
                            localStorage.setItem("token", token!)
                            navigate("/user");
                        } catch (error: unknown) {
                            if (error instanceof AxiosError) {
                                if (!error.response) {
                                    toast.error("Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000");
                                } else {
                                    toast.error(error.response.data?.detail || "Google authentication failed");
                                }
                            } else if (error instanceof Error) {
                                toast.error(error.message || "Authentication failed");
                            } else {
                                toast.error("Authentication failed. Please check if the backend is running.");
                            }
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