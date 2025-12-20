export type UserRole = "admin" | "user"
export type UserStatus = "active" | "suspended"

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
}
