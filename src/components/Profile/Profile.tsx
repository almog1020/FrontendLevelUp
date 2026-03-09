import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserProfileCard} from './UserProfileCard/UserProfileCard';
import {PersonalInfoCard} from './PersonalInfoCard/PersonalInfoCard';
import {PreferencesCard} from './PreferencesCard/PreferencesCard';
import {UserReviewsCard} from './UserReviewsCard/UserReviewsCard';
import styles from './Profile.module.scss';
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const auth = useContext(AuthContext);
    const currentUser = auth?.user

    function handleLoading(flag:boolean) {
        setLoading(flag);
    }
    return (
        <>
            {loading || !currentUser?
                <div className={styles.container}>
                    <div className={styles.loading}>Loading profile...</div>
                </div>
                :
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
                            <UserProfileCard
                                profile={currentUser!}
                            />
                        </div>

                        {/* Right column: Information cards, activity feed, and quick actions */}
                        <div className={styles.rightColumn}>
                            {/* Personal information card with edit functionality */}
                            <PersonalInfoCard
                                profile={currentUser!}
                                isGoogleUser={!!currentUser?.google_id}
                                onUpdate={handleLoading}
                            />
                            {/* Preferences card for managing gaming preferences */}
                            <PreferencesCard
                                profile={currentUser!}
                                onUpdate={handleLoading}
                            />
                            {/* User's reviews */}
                            <UserReviewsCard userId={currentUser!.id} />
                        </div>
                    </div>
                </div>
            }
        </>

    )
        ;
};

export default Profile;
