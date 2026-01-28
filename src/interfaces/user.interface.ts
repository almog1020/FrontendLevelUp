export type UserRole = "admin" | "user"
export type UserStatus = "active" | "suspended" | "inactive"

/**
 * UserBase payload for PUT /users/{email}.
 * Matches backend UserBase exactly (paths, payload structure, field names).
 * Use snake_case for last_active, favorite_genre, preferred_store.
 */
export interface UserBasePayload {
    email: string;
    name: string;
    password?: string;
    google_id?: string;
    role: UserRole;
    status: UserStatus;
    purchase: number;
    joined?: string;
    last_active?: string;
    favorite_genre?: string;
    preferred_store?: string;
}

/**
 * User Interface
 * Represents the full user model in the database
 * NOTE: This interface includes password for internal/database use only
 * API responses should NEVER include password - use UserResponse instead
 */
export interface User {
    id: number;
    name: string;
    email: string;
    password: string; // Only for database/internal use, NEVER returned in API responses
    role: UserRole;
    status: UserStatus;
    joined: string;
    lastActive: string;
    purchase: string;
    google_id: string;
}
/**
 * UserResponse Interface
 * Represents user data returned from the API (without password)
 * Backend should NEVER send password hashes to the frontend
 */
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    joined: string;
    lastActive: string;
    purchase: string;
    google_id: string;
    status: UserStatus;
}