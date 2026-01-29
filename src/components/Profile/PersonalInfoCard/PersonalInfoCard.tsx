/**
 * PersonalInfoCard Component
 * Displays user's personal information with edit functionality
 * Allows users to update their name, email address, and password
 * Role field is read-only and cannot be edited
 * Google users cannot edit their profile (managed by Google)
 * 
 * Password Handling:
 * - Frontend NEVER receives or displays existing passwords (hashed or plain)
 * - Password field is only for setting a NEW password
 * - New password is sent to backend in plain text
 * - Backend hashes the password before storing it in the database
 * - If password field is left blank, no password update is sent
 */

import React, { useEffect } from 'react';
import type { Profile } from '../../../interfaces/profile.interface';
import styles from './PersonalInfoCard.module.scss';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

interface PersonalInfoCardProps {
    profile: Profile;
    onUpdate?: (profile: Partial<Profile> & { password?: string }) => void | Promise<void>;
    isGoogleUser?: boolean;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ profile, onUpdate, isGoogleUser = false }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string, email: string, password: string }>(
        { defaultValues: { name: profile.name, email: profile.email, password: '' } })

    // Update form when profile prop changes
    useEffect(() => {
        reset({ name: profile.name, email: profile.email, password: '' });
    }, [profile.name, profile.email, reset]);

    const onSubmit = async (data: { name: string, email: string, password: string }) => {
        try {
            const updateData: Partial<Profile & { password?: string }> = {};
            if (data.name !== profile.name) updateData.name = data.name;
            if (data.email !== profile.email) updateData.email = data.email;
            if (data.password && data.password.trim() !== '') updateData.password = data.password;

            if (Object.keys(updateData).length > 0) {
                await onUpdate?.(updateData);
                reset({ name: data.name, email: data.email, password: '' });
            } else {
                toast.info('No changes to save');
            }
        } catch (error: unknown) {
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
                    <label className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        className={`${styles.input} ${isGoogleUser ? styles.disabled : ''}`}
                        disabled={isGoogleUser}
                        {...register('name')}
                    />
                </div>

                {/* Email Address field - editable when in edit mode */}
                <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        className={`${styles.input} ${isGoogleUser ? styles.disabled : ''}`}
                        disabled={isGoogleUser}
                        {...register('email')}
                    />
                </div>
                {!isGoogleUser && (
                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="Leave blank to keep current password"
                            {...register('password', {
                                validate: (value) => {
                                    if (!value || value.trim() === '') return true; // Allow empty (no change)
                                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
                                    return regex.test(value) || 'Password must be 8-10 characters with uppercase, lowercase, number, and symbol (@$!%*?&)';
                                }
                            })}
                        />
                        {errors.password && (
                            <span className={styles.error}>{errors.password.message}</span>
                        )}
                    </div>
                )}
                {/* Role field - read-only, cannot be edited */}
                <div className={styles.field}>
                    <label className={styles.label}>Role</label>
                    <div className={styles.value}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </div>   
                </div>
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
