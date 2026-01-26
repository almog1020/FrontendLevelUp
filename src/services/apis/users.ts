import {API_BASE_URL, instance, instanceAuth} from "./config.ts";
import axios, {AxiosError} from "axios";
import type {RegisterResponse} from "../../interfaces/sign.interface.ts";
import type {User, UserResponse, UserStatus} from "../../interfaces/user.interface.ts";
import type {Token} from "../../interfaces/token.interface.ts";

export async function login(username: string, password: string):Promise<Token> {
    try {
        return (await instanceAuth.post('/auth/token',{username,password})).data
    }catch(e:unknown) {
        console.error(e)
        if (e instanceof AxiosError) {
            if (e.response?.status === 422) {
                throw new Error('Password incorrect');
            }
            throw new Error(e.response?.data?.detail || 'Login failed');
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
export async function logout(email:string,disable:UserStatus): Promise<void> {
    try {
        await instance.put(`/users/${email}/logout?disable=${disable}`)
    }catch(e:unknown) {
        if (e instanceof AxiosError)
            throw new Error(e.response!.data.detail);
        throw e;
    }
}
export async function getMe(accessToken:string): Promise<UserResponse> {
    try {
        return (await axios.create({
            baseURL: API_BASE_URL,
            timeout: 1000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            },
        }).get('/users/me')).data;

    }catch(e:unknown) {
        if (e instanceof AxiosError)
            throw new Error(e.response!.data.detail);
        throw e;
    }
}
