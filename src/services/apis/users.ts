import {instance} from "./config.ts";

export async function login(email: string, password: string) {
    return (await instance.post('/users/login',{email: email, password: password})).data;
}