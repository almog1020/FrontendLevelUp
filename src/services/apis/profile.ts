import { instanceAuth } from "./config.ts";
import { AxiosError } from "axios";
import type { UserPreferences } from "../../interfaces/profile.interface.ts";
import type { UserBasePayload } from "../../interfaces/user.interface.ts";

/**
 * Profile API Service
 * Uses backend as single source of truth: GET /users/me, PUT /users/{email}, PUT /users/preferences.
 * All functions use instanceAuth which includes authentication headers.
 */

/**
 * Updates the user's profile via PUT /users/{email}.
 * Uses the backend UPDATE endpoint exactly: path /users/{email}, body UserBase.
 * @param email - User email (path param, identifies user to update)
 * @param payload - UserBase payload (name, email, password?, role, status, purchase, etc.)
 * @throws Error if the API request fails or update is not authorized
 */
export async function updateProfileBackend(email: string, payload: UserBasePayload): Promise<void> {
    try {
        await instanceAuth.put(`/users/${encodeURIComponent(email)}`, payload);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running at http://127.0.0.1:8000');
            }
            throw new Error(e.response?.data?.detail || 'Failed to update profile');
        }
        throw e;
    }
}

/**
 * Updates the user's gaming preferences via PUT /users/preferences.
 * Payload: { favoriteGenre, preferredStore } exactly as defined by backend.
 * @param preferences - User preferences (favoriteGenre, preferredStore)
 * @throws Error if the API request fails or update is not authorized
 */
export async function updatePreferences(preferences: UserPreferences): Promise<void> {
    try {
        await instanceAuth.put('/users/preferences', preferences);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data?.detail || 'Failed to update preferences');
        }
        throw e;
    }
}
