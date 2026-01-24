/**
 * Profile Component
 * Main profile page component that displays user's profile information, statistics, preferences, and activities
 * 
 * Layout Structure:
 * - Left Column: UserProfileCard (avatar, name, badge) and StatisticsCard (metrics)
 * - Right Column: PersonalInfoCard, PreferencesCard, RecentActivityCard, and QuickActions
 * 
 * Features:
 * - Displays user profile information with avatar
 * - Shows gaming statistics (wishlist, savings, tracked games, etc.)
 * - Allows editing personal information
 * - Manages user preferences (favorite genre, preferred store)
 * - Displays recent activity feed
 * - Provides quick action buttons for navigation
 */

import React, { useState, useEffect } from 'react';
import type { ProfileData } from '../../interfaces/profile.interface';
import { getProfile, updateProfile, updatePreferences } from '../../services/apis/profile';
import { getCurrentUser } from '../../services/apis/users';
import { UserProfileCard } from './UserProfileCard/UserProfileCard';
import { StatisticsCard } from './StatisticsCard/StatisticsCard';
import { PersonalInfoCard } from './PersonalInfoCard/PersonalInfoCard';
import { PreferencesCard } from './PreferencesCard/PreferencesCard';
//import { RecentActivityCard } from './RecentActivityCard/RecentActivityCard';
import { QuickActions } from './QuickActions/QuickActions';
import styles from './Profile.module.scss';
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
    // State management for profile data, loading status, and error handling
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load profile data when component mounts
    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Loads user profile data from the API
     * Fetches current user data from /users/me or /profile endpoint
     * Note: Backend should NEVER return password (hashed or plain text) in the response
     */
    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to fetch profile data - use getProfile first as it contains all data
            // If that fails, try to get user data from /users/me as fallback
            let data: ProfileData;
            
            try {
                // Fetch full profile data from /profile endpoint
                // Backend should return ProfileData WITHOUT any password fields
                data = await getProfile();
            } catch (profileError) {
                // If /profile fails, try to get user data and create minimal profile
                console.warn('Failed to fetch from /profile, trying /users/me:', profileError);
                
                try {
                    const currentUser = await getCurrentUser();
                    
                    // Create minimal profile data structure
                    // Note: currentUser does NOT contain password (UserResponse interface)
                    data = {
                        profile: {
                            id: currentUser.id,
                            name: currentUser.name,
                            email: currentUser.email,
                            role: currentUser.role,
                            memberSince: currentUser.joined,
                            lastLogin: currentUser.lastActive,
                        },
                        statistics: {
                            wishlistItems: 0,
                            totalSaved: 0,
                            gamesTracked: 0,
                            priceAlerts: 0,
                            reviewsWritten: 0,
                        },
                        preferences: {
                            favoriteGenre: 'Action',
                            preferredStore: 'Steam',
                        },
                        activities: [],
                    };
                } catch (userError) {
                    // Both endpoints failed - backend is likely not running
                    const errorMsg = userError instanceof Error ? userError.message : 'Unknown error';
                    if (errorMsg.includes('timeout') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('Cannot connect')) {
                        throw new Error('Backend server is not running. Please start the backend server at http://127.0.0.1:8000');
                    }
                    throw userError;
                }
            }

            setProfileData(data);
            setLoading(false);
        } catch (err) {
            // Handle errors during profile loading
            const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
            setError(errorMessage);
            setLoading(false);
            toast.error(errorMessage);
            console.error('Profile loading error:', err);
        }
    };


    /**
     * Handles updating user's profile information
     * Called when user saves changes in PersonalInfoCard
     * @param profile - Partial profile object containing fields to update
     */
    const handleProfileUpdate = async (profile: Partial<ProfileData['profile']>) => {
        if (!profileData) return;
        try {
            // Call API to update profile on backend
            await updateProfile(profile);
            // Update local state with new profile data
            setProfileData({
                ...profileData,
                profile: {
                    ...profileData.profile,
                    ...profile,
                },
            });
            toast.success('Profile updated successfully');
            // Reload profile to ensure we have the latest data
            await loadProfile();
        } catch (err) {
            // Handle errors during profile update
            toast.error(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };

    /**
     * Handles updating user's gaming preferences
     * Called when user saves changes in PreferencesCard
     * @param preferences - User preferences object (favoriteGenre, preferredStore)
     */
    const handlePreferencesUpdate = async (preferences: ProfileData['preferences']) => {
        if (!profileData) return;
        try {
            // Call API to update preferences on backend
            await updatePreferences(preferences);
            // Update local state with new preferences
            setProfileData({
                ...profileData,
                preferences,
            });
            toast.success('Preferences updated successfully');
        } catch (err) {
            // Handle errors during preferences update
            toast.error(err instanceof Error ? err.message : 'Failed to update preferences');
        }
    };

    // Display loading state while fetching profile data
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading profile...</div>
            </div>
        );
    }

    // Display error state if profile loading failed
    // Includes retry button to attempt loading again
    if (error || !profileData) {
        const isBackendError = error?.includes('Cannot connect to server') || error?.includes('Backend server is not running');
        
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <div className={styles.errorMessage}>
                        {error || 'Failed to load profile'}
                    </div>
                    {isBackendError && (
                        <div className={styles.errorDetails}>
                            <p><strong>To fix this:</strong></p>
                            <ol style={{ textAlign: 'left', maxWidth: '500px', margin: '16px auto' }}>
                                <li>Make sure your backend server is running</li>
                                <li>Check that it's running on <code>http://127.0.0.1:8000</code></li>
                                <li>Verify the backend API endpoints are available</li>
                                <li>Check your backend logs for any errors</li>
                            </ol>
                        </div>
                    )}
                    <button onClick={loadProfile} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Main profile page layout
    // Two-column responsive grid layout
    return (
        <div className={styles.container}>
            {/* Page header with title and subtitle */}
            <div className={styles.header}>
                <h1 className={styles.title}>Profile</h1>
                <p className={styles.subtitle}>Manage your account settings and preferences</p>
            </div>
            
            {/* Main content area with two columns */}
            <div className={styles.content}>
                {/* Left column: User profile card and statistics */}
                <div className={styles.leftColumn}>
                    {/* Displays user avatar, name, email, role badge, member since, and last login */}
                    <UserProfileCard profile={profileData.profile} />
                    {/* Displays gaming statistics (wishlist items, total saved, games tracked, etc.) */}
                    <StatisticsCard statistics={profileData.statistics} />
                </div>
                
                {/* Right column: Information cards, activity feed, and quick actions */}
                <div className={styles.rightColumn}>
                    {/* Personal information card with edit functionality */}
                    <PersonalInfoCard 
                        profile={profileData.profile}
                        onUpdate={handleProfileUpdate}
                    />
                    {/* Preferences card for managing gaming preferences */}
                    <PreferencesCard
                        preferences={profileData.preferences}
                        onUpdate={handlePreferencesUpdate}
                    />
                    {/* Recent activity feed showing user's latest actions */}
                    {/* <RecentActivityCard activities={profileData.activities} /> */}
                    {/* Quick action buttons for navigation (Wishlist, Dashboard, Admin Panel, Support) */}
                    <QuickActions userRole={profileData.profile.role} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
