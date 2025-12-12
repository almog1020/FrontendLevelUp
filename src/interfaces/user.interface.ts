export interface User {
    name: string;
    email: string;
    role: "admin" | "user";
    status: "active" | "suspended";
    joined: string;
    lastActive: string;
    wishlist: string;
}