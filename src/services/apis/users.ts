import {instance} from "./config.ts";
import {AxiosError} from "axios";
import type {RegisterResponse} from "../../interfaces/sign.interface.ts";
import type {User} from "../../interfaces/user.interface.ts";

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

export async function register(email: string, password: string, name: string): Promise<RegisterResponse> {
    try {
        return (
            await instance.post('/users/register', {email, password, name})
        ).data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 400) {
                throw new Error(e.response.data.detail || 'Email already registered');
            }
            throw new Error(e.response?.data?.detail || 'Registration failed');
        }
        throw e;
    }
}
export async function deleteUser(email:string): Promise<void> {
    try {
        await instance.delete(`/users/${email}`)
    }catch(e:unknown) {
        if (e instanceof AxiosError)
            throw new Error(e.response!.data.detail);
        throw e;
    }
}
export async function updateUser(email:string,editUser:User): Promise<void> {
    try {
        await instance.put(`/users/${email}`,{...editUser})
    }catch(e:unknown) {
        if (e instanceof AxiosError)
            throw new Error(e.response!.data.detail);
        throw e;
    }
}