import type {UseFormRegister} from "react-hook-form";

export interface FormValues {
    email: string
    password: string
    name:string
}
export interface ITextFieldSignIn {
    title: string;
    type: string;
    required: boolean
    name: keyof FormValues;
    register: UseFormRegister<FormValues>
}