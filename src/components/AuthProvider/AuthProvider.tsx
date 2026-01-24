import {createContext, type ReactNode} from "react";
import { useNavigate } from "react-router-dom";
import {login, logout} from "../../services/apis/users.ts";
import {toast} from "react-toastify";
import {googleLogout} from "@react-oauth/google";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<undefined |
    {loginAction(email:string,password:string):Promise<void>,logOut(email:string):void}>(undefined);

const AuthProvider = ({ children }:{children:ReactNode}) => {
    const navigate = useNavigate();

    const loginAction = async (email:string,password:string) => {
        try {
            const token = await login(email, password);
            const user = await getMe(token.access_token);
            localStorage.setItem("user", user.email)
            localStorage.setItem("token", token.access_token)
            navigate("/user");
        } catch (err) {
            toast.error((err as Error).message);
        }
    };

    const logOut = async (email:string) => {
        await logout(email,"inactive")
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        googleLogout()
        navigate("/login");
    };

    return (
        <AuthContext value={{ loginAction, logOut }}>
            {children}
        </AuthContext>
    );

};

export default AuthProvider;
