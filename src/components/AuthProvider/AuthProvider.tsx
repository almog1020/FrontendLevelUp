import {createContext, type ReactNode, useEffect, useState} from "react";
import {getMe} from "../../services/apis/users.ts";
import type {User} from "../../interfaces/user.interface.ts";
import {toast} from "react-toastify";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<undefined |
    {
        user?:User,
        fetchUser():Promise<void>,
        logout():void,
    }>(undefined);

const AuthProvider = ({ children }:{children:ReactNode}) => {
    const [user, setUser] = useState<User>();
    useEffect(() => {
        getMe()
            .then(user => setUser(user))
            .catch(() => setUser(undefined));
    }, []);

    const fetchUser = async () => {
        try {
            const user = await getMe();
            setUser(user);
        }catch(err:unknown){
            toast.error(err instanceof Error ? err.message : 'Failed to load profile')
        }
    }
    const logout = () => {
        setUser(undefined)
    }
    return (
        <AuthContext value={{user,fetchUser,logout }}>
            {children}
        </AuthContext>
    );

};

export default AuthProvider;
