/**
 * UserProfileCard Component
 * Displays the user's profile card with avatar, name, email, role badge, and account information
 * Shows member since date and last login time in a formatted, user-friendly way
 */

import * as React from 'react';
import type { Profile } from '../../../interfaces/profile.interface';
import styles from './UserProfileCard.module.scss';

interface UserProfileCardProps {
    profile: Profile;
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
     * @param dateString - ISO date string
     * @returns Formatted date string
     */
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    /**
     * Formats last login timestamp into a user-friendly format
     * If login was today, shows "Today at [time]"
     * Otherwise shows full date
     * @param dateString - ISO date string of last login
     * @returns Formatted last login string
     */
    const formatLastLogin = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        // If login was within last 24 hours, show "Today at [time]"
        if (diffHours < 24) {
            return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        }
        // Otherwise show full date
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={styles.card}>
            {/* Avatar section: shows image if available, otherwise displays initials */}
            <div className={styles.avatar}>
                {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} />
                ) : (
                    <div className={styles.avatarInitials}>{getInitials(profile.name)}</div>
                )}
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
                <span>Member since {formatDate(profile.memberSince)}</span>
            </div>
            
            {/* Last login information with user icon */}
            <div className={styles.infoRow}>
                <span className={styles.icon}>👤</span>
                <span>Last login: {formatLastLogin(profile.lastLogin)}</span>
            </div>
        </div>
    );
};
