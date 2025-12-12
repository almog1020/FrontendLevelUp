export interface SignUpFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
    name: string | null;
    google_id: string | null;
}

