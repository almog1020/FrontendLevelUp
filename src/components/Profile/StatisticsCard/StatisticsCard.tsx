/**
 * StatisticsCard Component
 * Displays user's gaming statistics in a card format
 * Shows metrics like wishlist items, games tracked, and price alerts
 */

import React from 'react';
import type { ProfileStatistics } from '../../../interfaces/profile.interface';
import styles from './StatisticsCard.module.scss';

interface StatisticsCardProps {
    statistics: ProfileStatistics; // Statistics data containing all metrics
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
    // Array of statistics to display
    const stats = [
        { icon: '❤️', label: 'Wishlist Items', value: statistics.wishlistItems },
        { icon: '⭐', label: 'Games Tracked', value: statistics.gamesTracked },
        { icon: '📉', label: 'Price Alerts', value: statistics.priceAlerts },
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
                        {/* Value */}
                        <span className={styles.value}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
