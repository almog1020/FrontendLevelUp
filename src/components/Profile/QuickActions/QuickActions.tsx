/**
 * QuickActions Component
 * Displays quick action buttons for common navigation tasks
 * Shows different actions based on user role (Admin Panel only visible to admins)
 * Provides shortcuts to Wishlist, Dashboard, Admin Panel, and Support pages
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuickActions.module.scss';

interface QuickActionsProps {
    userRole: string; // User's role to determine which actions to show
}

export const QuickActions: React.FC<QuickActionsProps> = ({ userRole }) => {
    const navigate = useNavigate();

    // Array of available quick actions
    // Admin Panel is only visible if userRole is 'admin'
    // Filter removes actions that shouldn't be visible to current user
    const actions = [
        { icon: '❤️', label: 'View Wishlist', path: '/wishlist', visible: true },
        { icon: '🛒', label: 'Dashboard', path: '/dashboard', visible: true },
        { icon: '🛡️', label: 'Admin Panel', path: '/admin/management', visible: userRole === 'admin' },
        { icon: '✉️', label: 'Support', path: '/support', visible: true },
    ].filter(action => action.visible);

    /**
     * Handles navigation when a quick action button is clicked
     * @param path - Route path to navigate to
     */
    const handleAction = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Quick Actions</h3>
            {/* Grid layout for action buttons (2 columns) */}
            <div className={styles.actionsGrid}>
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={styles.actionButton}
                        onClick={() => handleAction(action.path)}
                    >
                        {/* Icon for visual identification */}
                        <span className={styles.icon}>{action.icon}</span>
                        {/* Action label text */}
                        <span className={styles.label}>{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
