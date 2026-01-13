import {GoogleLogin} from "@react-oauth/google";
import {toast} from "react-toastify";
import type {UserResponse} from "../../../interfaces/user.interface.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const LoginButton = () => {
    const navigate = useNavigate();
    return (
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;
                        try {
                            const user:UserResponse = (await axios.create({
                                baseURL: 'http://127.0.0.1:8000/',
                                timeout: 1000,
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                },
                            }).post('/auth/google',{token})).data;

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