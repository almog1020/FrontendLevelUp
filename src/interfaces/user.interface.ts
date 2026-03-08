export type UserRole = "admin" | "user"
export type UserStatus = "active" | "suspended" | "inactive"

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    google_id: string;
    status: UserStatus;
    joined: string;
    favorite_genre: string;
    preferred_store: string;
}
export interface User extends UserResponse{
    password: string;
}

