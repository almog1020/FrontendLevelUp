import * as React from 'react';
import styles from './UserProfileCard.module.scss';
import type {User} from "../../../interfaces/user.interface.ts";

interface UserProfileCardProps {
    profile: User;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
    /**
     * Extracts initials from user's name for avatar fallback
     * Takes first letter of first two words and converts to uppercase
     * Example: "John Doe" -> "JD", "Admin User" -> "AU"
     * @param name - User's full name
     * @returns String with 1-2 uppercase letters
     */
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    /**
     * Formats a date string into a readable format (e.g., "January 2024")
     * Used for displaying member since date
     * @param dateString - ISO date string (optional)
     * @returns Formatted date string or fallback
     */
    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className={styles.card}>
            {/* Avatar section: shows image if available, otherwise displays initials */}
            <div className={styles.avatar}>
                <div className={styles.avatarInitials}>{getInitials(profile.name)}</div>
            </div>
            
            {/* User's full name */}
            <div className={styles.name}>{profile.name}</div>
            
            {/* User's email address */}
            <div className={styles.email}>{profile.email}</div>
            
            {/* Role badge: styled differently for admin (orange) vs user (green) */}
            <div className={`${styles.badge} ${styles[profile.role]}`}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>
            
            {/* Member since date with calendar icon */}
            <div className={styles.infoRow}>
                <span className={styles.icon}>📅</span>
                <span>Member since {formatDate(profile.joined)}</span>
            </div>
        </div>
    );
};
