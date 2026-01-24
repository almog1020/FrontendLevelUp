import { instanceAuth } from "./config.ts";
import { AxiosError } from "axios";
import type { ProfileData, UserPreferences } from "../../interfaces/profile.interface.ts";
import type { Profile } from "../../interfaces/profile.interface.ts";

/**
 * Profile API Service
 * Contains all API functions related to user profile operations
 * All functions use instanceAuth which includes authentication headers
 */

/**
 * Fetches the complete profile data for the authenticated user
 * Makes a GET request to /profile endpoint
 * Backend should NEVER return password (hashed or plain text) in the response
 * @returns Promise<ProfileData> - Complete profile data including profile info, statistics, preferences, and activities
 * @throws Error if the API request fails or user is not authenticated
 */
export async function getProfile(): Promise<ProfileData> {
    try {
        const response = await instanceAuth.get('/profile');
        return response.data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            if (e.response.status === 401 || e.response.status === 403) {
                throw new Error('Authentication failed. Please log in again.');
            }
            throw new Error(e.response?.data?.detail || `Failed to fetch profile (${e.response.status})`);
        }
        throw e;
    }
}

/**
 * Updates the user's profile information
 * Makes a PUT request to /profile endpoint with partial profile data
 * Only the fields provided in the profile parameter will be updated
 * 
 * Password Handling:
 * - If password is provided, it should be sent in plain text
 * - Backend MUST hash the password using bcrypt/argon2 before storing
 * - Backend should NEVER return password (hashed or plain) in any response
 * 
 * @param profile - Partial profile object containing fields to update (name, email, password, etc.)
 * @returns Promise<void>
 * @throws Error if the API request fails or update is not authorized
 */
export async function updateProfile(profile: Partial<Profile & { password?: string }>): Promise<void> {
    try {
        await instanceAuth.put('/profile', profile);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data?.detail || 'Failed to update profile');
        }
        throw e;
    }
}

/**
 * Updates the user's gaming preferences
 * Makes a PUT request to /profile/preferences endpoint
 * @param preferences - User preferences object containing favoriteGenre and preferredStore
 * @returns Promise<void>
 * @throws Error if the API request fails or update is not authorized
 */
export async function updatePreferences(preferences: UserPreferences): Promise<void> {
    try {
        await instanceAuth.put('/profile/preferences', preferences);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data?.detail || 'Failed to update preferences');
        }
        throw e;
    }
}
