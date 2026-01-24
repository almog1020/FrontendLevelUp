/**
 * PersonalInfoCard Component
 * Displays user's personal information with edit functionality
 * Allows users to update their name, email address, and password
 * Role field is read-only and cannot be edited
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
import { updateProfile } from '../../../services/apis/profile';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';


interface PersonalInfoCardProps {
    profile: Profile;
    onUpdate?: (profile: Partial<Profile>) => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ profile, onUpdate }) => {

    const { register, handleSubmit, reset } = useForm<{ name: string, email: string, password: string }>(
        { defaultValues: { name: profile.name, email: profile.email, password: '' } })

    // Update form when profile prop changes
    useEffect(() => {
        reset({ name: profile.name, email: profile.email, password: '' });
    }, [profile.name, profile.email, reset]);

    const onSubmit = async (data: { name: string, email: string, password: string }) => {
        try {
            // Only send fields that have been changed and are not empty
            const updateData: Partial<Profile & { password?: string }> = {};
            if (data.name !== profile.name) {
                updateData.name = data.name;
            }
            if (data.email !== profile.email) {
                updateData.email = data.email;
            }
            // Only include password if user provided a new one
            // Password is sent in plain text to backend, which will hash it before storing
            // Backend should NEVER return password hashes to frontend
            if (data.password && data.password.trim() !== '') {
                updateData.password = data.password;
            }

            // Only make API call if there are changes
            if (Object.keys(updateData).length > 0) {
                await updateProfile(updateData);
                // Notify parent component to refresh profile data
                if (onUpdate) {
                    onUpdate(updateData);
                }
                // Reset password field after successful update
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
                    <p className={styles.subtitle}>Update your profile details</p>
                </div>
            </div>

            {/* Form fields section */}
            <div className={styles.fields}>
                {/* Full Name field - editable when in edit mode */}
                <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        {...register('name')}
                    />
                </div>

                {/* Email Address field - editable when in edit mode */}
                <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        className={styles.input}
                        {...register('email')}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="Leave blank to keep current password"
                        {...register('password')}
                    />
                </div>
                {/* Role field - read-only, cannot be edited */}
                <div className={styles.field}>
                    <label className={styles.label}>Role</label>
                    <div className={styles.value}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </div>   
                </div>
            </div>
            <div className={styles.actionButtons}>
                <button className={styles.saveButton} type="submit">
                    Save
                </button>
            </div>
        </div>
    </form>

);
};
