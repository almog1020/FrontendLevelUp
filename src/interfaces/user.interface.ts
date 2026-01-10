export type UserRole = "admin" | "user"
export type UserStatus = "active" | "suspended" | "inactive"

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    joined: string;
    lastActive: string;
    purchase: string;
    google_id: string;
}
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    google_id: string;
    status: UserStatus;
}