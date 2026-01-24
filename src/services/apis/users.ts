import {API_BASE_URL, instance, instanceAuth} from "./config.ts";
import axios, {AxiosError} from "axios";
import type {RegisterResponse} from "../../interfaces/sign.interface.ts";
import type {User, UserResponse, UserStatus} from "../../interfaces/user.interface.ts";
import type {Token} from "../../interfaces/token.interface.ts";

/**
 * Authenticates a user with email and password
 * Password is sent in plain text to backend for verification
 * Backend compares plain password with stored hash using bcrypt/argon2
 * Backend returns authentication token (NO password in response)
 * 
 * @param username - User's email address
 * @param password - User's password in plain text
 * @returns Authentication token
 * @throws Error if authentication fails
 */
export async function login(username: string, password: string): Promise<Token> {
    try {
        // Password sent in plain text - backend handles hashing/verification
        return (await instanceAuth.post('/auth/token',{username,password})).data
    }catch(e:unknown) {
        console.error(e)
        if (e instanceof AxiosError) {
            // Check if response exists (backend might not be running)
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            if (e.response.status === 422) {
                throw new Error('Password incorrect');
            }
            throw new Error(e.response.data?.detail || 'Login failed. Please check your credentials.');
        }
        throw e;
    }
}

/**
 * Registers a new user
 * Password is sent in plain text to backend
 * Backend MUST hash the password using bcrypt/argon2 before storing
 * Backend should return user data WITHOUT password
 * 
 * @param email - User's email address
 * @param password - User's password in plain text (will be hashed by backend)
 * @param name - User's full name
 * @returns RegisterResponse - User data without password
 * @throws Error if registration fails
 */
export async function register(email: string, password: string, name: string): Promise<RegisterResponse> {
    try {
        // Password sent in plain text - backend will hash it before storing
        return (
            await instance.post('/users/register', {email, password, name})
        ).data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            // Check if response exists (backend might not be running)
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
 * Makes a GET request to /users/me endpoint
 * Backend should return user data WITHOUT password (hashed or otherwise)
 * @returns Promise<UserResponse> - Current user data (password excluded)
 * @throws Error if the API request fails or user is not authenticated
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
