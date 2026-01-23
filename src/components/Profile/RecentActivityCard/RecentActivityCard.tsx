/**
 * RecentActivityCard Component
 * Displays a list of user's recent activities/actions on the platform
 * Shows activities like wishlist additions, purchases, reviews, and price alerts
 * Formats timestamps in a user-friendly relative format (e.g., "2 hours ago", "3 days ago")
 */

import React from 'react';
import type { ActivityItem } from '../../../interfaces/profile.interface';
import styles from './RecentActivityCard.module.scss';

interface RecentActivityCardProps {
    activities: ActivityItem[]; // Array of activity items to display
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
    /**
     * Returns the appropriate emoji icon based on activity type
     * @param type - Type of activity (wishlist, purchase, review, price_alert)
     * @returns Emoji string representing the activity type
     */
    const getActivityIcon = (type: ActivityItem['type']): string => {
        switch (type) {
            case 'wishlist':
                return '❤️';
            case 'purchase':
                return '🛒';
            case 'review':
                return '⭐';
            case 'price_alert':
                return '📉';
            default:
                return '📌';
        }
    };

    /**
     * Generates a human-readable description for an activity
     * Formats the description based on activity type and includes the game name
     * @param activity - Activity item to generate description for
     * @returns Formatted description string
     */
    const getActivityDescription = (activity: ActivityItem): string => {
        switch (activity.type) {
            case 'wishlist':
                return `Added to wishlist ${activity.gameName}`;
            case 'purchase':
                return `Purchased from Steam ${activity.gameName}`;
            case 'review':
                return `Left a review ${activity.gameName}`;
            case 'price_alert':
                return `Price drop alert triggered ${activity.gameName}`;
            default:
                return activity.description;
        }
    };

    /**
     * Formats timestamp into a relative time format for better readability
     * Shows "Just now", "X hours ago", "X days ago", or full date if older than a week
     * @param timestamp - ISO timestamp string
     * @returns Formatted relative time string
     */
    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        // Less than 1 hour ago
        if (diffHours < 1) {
            return 'Just now';
        // Less than 24 hours ago - show hours
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        // Exactly 1 day ago
        } else if (diffDays === 1) {
            return '1 day ago';
        // Less than 7 days ago - show days
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        // More than a week - show date
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className={styles.card}>
            {/* Card header */}
            <div className={styles.header}>
                <h3 className={styles.title}>Recent Activity</h3>
                <p className={styles.subtitle}>Your latest actions on LevelUp</p>
            </div>
            
            {/* Activity list - shows empty state if no activities */}
            <div className={styles.activityList}>
                {activities.length === 0 ? (
                    <div className={styles.emptyState}>No recent activity</div>
                ) : (
                    // Map through activities and display each one
                    activities.map((activity) => (
                        <div key={activity.id} className={styles.activityItem}>
                            {/* Activity type icon */}
                            <span className={styles.icon}>{getActivityIcon(activity.type)}</span>
                            {/* Formatted activity description with game name */}
                            <span className={styles.description}>{getActivityDescription(activity)}</span>
                            {/* Relative timestamp (e.g., "2 hours ago") */}
                            <span className={styles.timestamp}>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
