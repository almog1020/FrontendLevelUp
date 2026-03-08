import React, {useContext} from 'react';
import styles from './PersonalInfoCard.module.scss';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import {updateUser} from "../../../services/apis/users.ts";
import type {User} from "../../../interfaces/user.interface.ts";
import {AuthContext} from "../../AuthProvider/AuthProvider.tsx";


interface PersonalInfoCardProps {
    profile: User;
    isGoogleUser: boolean;
    onUpdate: (loading:boolean) => void;
}
interface UpdatePersonalInfo {
    name: string,
    password: string
}
export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ profile, isGoogleUser,onUpdate }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<UpdatePersonalInfo>()
    const auth = useContext(AuthContext);

    const onSubmit = async (data:UpdatePersonalInfo) => {
        try {
            onUpdate(true)
            const {password,name} = data
            if (password)
                await updateUser(profile.email,{...profile,name:name,password:password})
            else
                await updateUser(profile.email,{...profile,name:name})
            auth?.fetchUser()
            await new Promise((resolve) => setTimeout(resolve, 2500));
            toast.success('User update successfully!');
            onUpdate(false)
        } catch (error: unknown) {
            onUpdate(false)
            toast.error((error as Error).message);
        }
    };

return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.card}>
            {/* Card header with title, subtitle, and action buttons */}
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Personal Information</h3>
                    <p className={styles.subtitle}>
                        {isGoogleUser 
                            ? 'Your profile is managed by Google' 
                            : 'Update your profile details'}
                    </p>
                </div>
            </div>

            {/* Google user notice */}
            {isGoogleUser && (
                <div className={styles.googleNotice}>
                    🔒 You signed in with Google. Profile details cannot be edited here.
                </div>
            )}

            {/* Form fields section */}
            <div className={styles.fields}>
                {/* Full Name field - editable when in edit mode */}
                <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                        type="text"
                        className={`${styles.input} ${isGoogleUser ? styles.disabled : ''}`}
                        disabled={isGoogleUser}
                        {...register('name')}
                        defaultValue={profile.name}
                        required={true}
                    />
                </div>
                {!isGoogleUser && (
                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="Leave blank to keep current password"
                            {...register("password", {
                                minLength: { value: 8, message: "Password must be at least 8 characters." },
                                maxLength: { value: 10, message: "Password must be at most 10 characters." },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                                    message: "Password must include upper, lower, number, and symbol (@$!%*?&).",
                                },
                            })}
                        />
                        {errors.password && (
                            <span className={styles.error}>{errors.password.message}</span>
                        )}
                    </div>
                )}
            </div>
            {!isGoogleUser && (
                <div className={styles.actionButtons}>
                    <button className={styles.saveButton} type="submit">
                        Save
                    </button>
                </div>
            )}
        </div>
    </form>

);
};
