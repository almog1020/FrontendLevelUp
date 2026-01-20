import * as React from 'react';
import styles from './UserProfile.module.scss';
import type { UserResponse } from '../../../interfaces/user.interface';

interface UserProfileProps {
    user: UserResponse;
}

interface ProfileField {
    label: string;
    value: string | number;
    valueClassName?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    // Profile fields data array - DRY approach
    const profileFields: ProfileField[] = [
        {
            label: 'Email',
            value: user.email
        },
        {
            label: 'Role',
            value: user.role ? user.role.toUpperCase() : 'Unknown'
        },
        {
            label: 'Status',
            value: user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown',
            valueClassName: user.status === 'active' ? styles.statusActive : user.status === 'suspended' ? styles.statusSuspended : ''
        },
        {
            label: 'Total Purchases',
            value: user.purchase
        }
    ];

    return (
        <div className={styles.profileCard}>
            <h2 className={styles.profileTitle}>Your Profile</h2>
            <div className={styles.profileGrid}>
                {profileFields.map((field, index) => (
                    <div key={index} className={styles.profileField}>
                        <p className={styles.profileLabel}>{field.label}</p>
                        <p className={`${styles.profileValue} ${field.valueClassName || ''}`}>
                            {field.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
