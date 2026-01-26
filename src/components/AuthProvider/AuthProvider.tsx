import {createContext, type ReactNode, useState} from "react";
import { useNavigate } from "react-router-dom";
import {login, logout, getMe} from "../../services/apis/users.ts";
import {toast} from "react-toastify";
import {googleLogout} from "@react-oauth/google";
import type {UserResponse} from "../../interfaces/user.interface.ts";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<undefined |
    {
        token: string;
        user: UserResponse | null;
        loginAction(user:UserResponse,access_token:string):void,
        logOut():void
    }>(undefined);

const AuthProvider = ({ children }:{children:ReactNode}) => {
    const navigate = useNavigate();

    const loginAction = async (email:string,password:string) => {
        try {
            const token = await login(email, password);
            const user = await getMe(token);
            localStorage.setItem("user", user.email)
            localStorage.setItem("token", token)
            navigate("/user");
        } catch (err) {
            toast.error((err as Error).message);
        }
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<UserResponse | null>(null);

    const loginAction = async (user:UserResponse,access_token:string) => {
        setToken(access_token)
        setUser(user)
        localStorage.setItem('token', access_token);
        navigate("/user");
    };

    const logOut = async () => {
        setUser(null)
        setToken("");
        localStorage.removeItem('token');
        navigate("/");
    };

    return (
        <AuthContext value={{ loginAction, logOut,token,user }}>
            {children}
        </AuthContext>
    );

};

export default AuthProvider;
