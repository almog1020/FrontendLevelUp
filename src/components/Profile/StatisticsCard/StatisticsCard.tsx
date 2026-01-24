/**
 * StatisticsCard Component
 * Displays user's gaming statistics in a card format
 * Shows metrics like wishlist items, total saved, games tracked, price alerts, and reviews written
 * "Total Saved" is displayed in green to highlight savings
 */

import React from 'react';
import type { ProfileStatistics } from '../../../interfaces/profile.interface';
import styles from './StatisticsCard.module.scss';

interface StatisticsCardProps {
    statistics: ProfileStatistics; // Statistics data containing all metrics
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
    // Array of statistics to display, each with icon, label, value, and optional styling
    // isGreen flag makes "Total Saved" display in green color
    const stats = [
        { icon: '❤️', label: 'Wishlist Items', value: statistics.wishlistItems },
        { icon: '🛒', label: 'Total Saved', value: `$${statistics.totalSaved}`, isGreen: true },
        { icon: '⭐', label: 'Games Tracked', value: statistics.gamesTracked },
        { icon: '📉', label: 'Price Alerts', value: statistics.priceAlerts },
        { icon: '⭐', label: 'Reviews Written', value: statistics.reviewsWritten },
    ];

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Statistics</h3>
            {/* List of statistics, each displayed as a row with icon, label, and value */}
            <div className={styles.statsList}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statItem}>
                        {/* Icon for visual identification */}
                        <span className={styles.icon}>{stat.icon}</span>
                        {/* Label describing what the statistic represents */}
                        <span className={styles.label}>{stat.label}</span>
                        {/* Value - green color applied if isGreen flag is true */}
                        <span className={`${styles.value} ${stat.isGreen ? styles.green : ''}`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
