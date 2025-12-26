import {createContext, type ReactNode} from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../../services/apis/users.ts";
import {toast} from "react-toastify";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<undefined |
    {loginAction(email:string,password:string):void,logOut():void}>(undefined);

const AuthProvider = ({ children }:{children:ReactNode}) => {
    const navigate = useNavigate();

    const loginAction = async (email:string,password:string) => {
        try {
            const token = await login(email, password);
            localStorage.setItem("user", email)
            localStorage.setItem("token", token)
            navigate("/userpopup");
        } catch (err) {
            toast.error((err as Error).message);
        }
    };

    const logOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AuthContext value={{ loginAction, logOut }}>
            {children}
        </AuthContext>
    );

};

export default AuthProvider;
