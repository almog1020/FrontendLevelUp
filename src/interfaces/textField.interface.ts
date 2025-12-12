import type {UseFormRegister, FieldValues} from "react-hook-form";

export interface FormValues {
    email: string
    password: string
}
export interface ITextField<T extends FieldValues = FormValues> {
    title: string;
    type:string;
    required:boolean
    name:keyof T;
    register: UseFormRegister<T>
}