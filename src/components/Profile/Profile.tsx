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
import { useNavigate } from 'react-router-dom';
import type { ProfileData } from '../../interfaces/profile.interface';
import type { UserResponse, User } from '../../interfaces/user.interface';
import { updateUser, getMe } from '../../services/apis/users';
import { UserProfileCard } from './UserProfileCard/UserProfileCard';
import { PersonalInfoCard } from './PersonalInfoCard/PersonalInfoCard';
import { PreferencesCard } from './PreferencesCard/PreferencesCard';
import { UserReviewsCard } from './UserReviewsCard/UserReviewsCard';
import styles from './Profile.module.scss';
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Loads user data from GET /users/me only (backend single source of truth).
     * Builds ProfileData for UI; stores currentUser for update payloads.
     */
    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const signInAction = localStorage.getItem('signInAction') ?? 'password';
            if (!token) {
                throw new Error('Not logged in');
            }
            const user = await getMe(token, signInAction);
            setCurrentUser(user);
            const data: ProfileData = {
                profile: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    memberSince: user.joined,
                    lastLogin: user.joined,
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
            setProfileData(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
            setError(errorMessage);
            setLoading(false);
            toast.error(errorMessage);
            console.error('Profile loading error:', err);
        } finally {
            setLoading(false);
        }
    };


    /**
     * Handles profile update via PUT /users/{email}.
     */
    const handleProfileUpdate = async (profile: Partial<ProfileData['profile']> & { password?: string }) => {
        if (!profileData || !currentUser) return;
        try {
            const payload: User = {
                id: currentUser.id,
                email: profile.email ?? currentUser.email,
                name: profile.name ?? currentUser.name,
                password: profile.password ?? '',
                role: currentUser.role,
                status: currentUser.status,
                joined: currentUser.joined,
                lastActive: '',
                purchase: String(currentUser.purchase),
                google_id: currentUser.google_id,
            };

            await updateUser(currentUser.email, payload);
            const { password: _p, ...profileUpdates } = profile;
            setProfileData({
                ...profileData,
                profile: { ...profileData.profile, ...profileUpdates },
            });
            toast.success('Profile updated successfully');
            await loadProfile();
        } catch (err) {
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
                <button className={styles.backButton} onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
                <h1 className={styles.title}>Profile</h1>
                <p className={styles.subtitle}>Manage your account settings and preferences</p>
            </div>
            
            {/* Main content area with two columns */}
            <div className={styles.content}>
                {/* Left column: User profile card */}
                <div className={styles.leftColumn}>
                    {/* Displays user avatar, name, email, role badge, member since, and last login */}
                    <UserProfileCard profile={profileData.profile} />
                </div>
                
                {/* Right column: Information cards, activity feed, and quick actions */}
                <div className={styles.rightColumn}>
                    {/* Personal information card with edit functionality */}
                    <PersonalInfoCard 
                        profile={profileData.profile}
                        onUpdate={handleProfileUpdate}
                        isGoogleUser={!!currentUser?.google_id}
                    />
                    {/* Preferences card for managing gaming preferences */}
                    <PreferencesCard
                        preferences={profileData.preferences}
                        onUpdate={handlePreferencesUpdate}
                    />
                    {/* User's reviews */}
                    <UserReviewsCard userId={profileData.profile.id} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
