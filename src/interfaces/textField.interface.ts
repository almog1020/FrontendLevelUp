import type {UseFormRegister} from "react-hook-form";

export interface FormValues {
    email: string
    password: string
}
export interface ITextField {
    title: string;
    type:string;
    required:boolean
    name:keyof FormValues;
    register: UseFormRegister<FormValues>
}