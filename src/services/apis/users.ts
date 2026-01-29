import {instance, instanceAuth} from "./config.ts";
import {AxiosError} from "axios";
import type {RegisterResponse} from "../../interfaces/sign.interface.ts";
import type {User, UserResponse, UserStatus} from "../../interfaces/user.interface.ts";

export async function login(username: string, password: string): Promise<string> {
    try {
        // OAuth2PasswordRequestForm expects form-urlencoded data
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        
        const response = await instanceAuth.post('/auth/token', params);
        return response.data.access_token;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            if (e.response?.status === 401 || e.response?.status === 422) {
                throw new Error('Incorrect email or password');
            }
            throw new Error(e.response?.data?.detail || 'Login failed');
        }
        throw e;
    }
}

/**
 * Registers a new user
 */
export async function register(email: string, password: string, name: string): Promise<RegisterResponse> {
    try {
        return (
            await instance.post('/users/register', {email, password, name})
        ).data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            if (e.response.status === 400) {
                throw new Error(e.response.data?.detail || 'Email already registered');
            }
            throw new Error(e.response.data?.detail || 'Registration failed');
        }
        throw e;
    }
}

export async function deleteUser(email:string): Promise<void> {
    try {
        await instance.delete(`/users/${email}`)
    }catch(e:unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            throw new Error(e.response.data?.detail || 'Failed to delete user');
        }
        throw e;
    }
}

export async function updateUser(email:string,editUser:User): Promise<void> {
    try {
        await instance.put(`/users/${email}`,{...editUser})
    }catch(e:unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            throw new Error(e.response.data?.detail || 'Failed to update user');
        }
        throw e;
    }
}

/**
 * Fetches the current authenticated user's data
 */
export async function getCurrentUser(): Promise<UserResponse> {
    try {
        const response = await instanceAuth.get('/users/me');
        return response.data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            if (e.response.status === 401 || e.response.status === 403) {
                throw new Error('Authentication failed. Please log in again.');
            }
            throw new Error(e.response?.data?.detail || `Failed to fetch current user (${e.response.status})`);
        }
        throw e;
    }
}

export async function getMe(token:string,signInAction:string): Promise<UserResponse> {
    try {
        if(signInAction === "password")
            return (await instance.get('/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })).data;
        return (await instance.post('/auth/google/me',{token})).data;

    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 401) {
                throw new Error('Unauthorized. Please log in again.');
            }
            throw new Error(e.response?.data?.detail || 'Failed to fetch user data');
        }
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
