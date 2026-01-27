import {createContext, type ReactNode} from "react";
import { useNavigate } from "react-router-dom";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<undefined |
    {
        // token: string;
        // user: UserResponse | null;
        loginAction(access_token:string,signInAction:"google" | "password"):void,
        logOut():void
    }>(undefined);

const AuthProvider = ({ children }:{children:ReactNode}) => {
    const navigate = useNavigate();

    const loginAction = async (access_token:string,signInAction:"google" | "password") => {
        localStorage.setItem('token', access_token);
        localStorage.setItem('signInAction', signInAction);
        navigate("/");
    };

    const logOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('signInAction');
        navigate("/");
    };

    return (
        <AuthContext value={{ loginAction, logOut, token, user }}>
            {children}
        </AuthContext>
    );

};

export default AuthProvider;
