import {createContext, type ReactNode} from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../../services/apis/users.ts";
import {toast} from "react-toastify";
import {googleLogout} from "@react-oauth/google";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<undefined |
    {loginAction(email:string,password:string):void,logOut():void}>(undefined);

const AuthProvider = ({ children }:{children:ReactNode}) => {
    const navigate = useNavigate();

    const loginAction = async (email:string,password:string) => {
        try {
            console.log('1. Login starting...', email);
            const token = await login(email, password);
            console.log('2. Token received:', token);
            
            localStorage.setItem("user", email)
            localStorage.setItem("token", token)
            console.log('3. Token stored in localStorage');
            
            navigate("/user");
            console.log('4. Navigating to /user');
        } catch (err) {
            console.error('Login error:', err);
            toast.error((err as Error).message);
        }
    };

    const logOut = () => {
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
