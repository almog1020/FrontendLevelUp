import type {UseFormRegister} from "react-hook-form";

export interface SignUpFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}
export interface ITextFieldSignUp {
    title: string;
    type: string;
    required: boolean
    name: keyof SignUpFormValues;
    register: UseFormRegister<SignUpFormValues>
}

export interface RegisterResponse {
    id: number;
    email: string;
    name: string | null;
    google_id: string | null;
}

