import {instance} from "./config.ts";
import {AxiosError} from "axios";

export async function login(email: string, password: string):Promise<{id:number,email:string,password:string}> {

    try {
        return (
            await instance.post('/users/login',{email: email, password: password})
        ).data;

    }catch(e:unknown) {
        if (e instanceof AxiosError) {
            if (e.status === 422)
                throw new Error('Password incorrect');
            throw new Error(e.response!.data.detail);
        }
        throw e;
    }

}