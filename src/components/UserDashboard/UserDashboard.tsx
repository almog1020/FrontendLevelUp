import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/apis/users';
import type { UserResponse } from '../../interfaces/user.interface';
import styles from './UserDashboard.module.scss';

export const UserDashboard = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser()
            .then(data => setUser(data))
            .catch(err => {
                if (err.message.includes('Unauthorized')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            });
    }, []);

    if (!user) return <div className={styles.loading}>Loading...</div>;

    // Placeholder stats (will connect to backend later)
    const stats = {
        wishlistItems: 12,
        priceDrops: 3,
        totalSaved: 127,
        gamesTracked: 47
    };

    // Placeholder data for price drops
    const priceDrops = [
        { id: '1', title: 'Cyberpunk 2077', oldPrice: 59.99, newPrice: 29.99, discount: 50, image: 'https://via.placeholder.com/80', timeAgo: '2 hours ago' },
        { id: '2', title: 'Elden Ring', oldPrice: 59.99, newPrice: 19.99, discount: 67, image: 'https://via.placeholder.com/80', timeAgo: '5 hours ago' },
        { id: '3', title: 'The Witcher 3', oldPrice: 39.99, newPrice: 9.99, discount: 75, image: 'https://via.placeholder.com/80', timeAgo: '1 day ago' },
    ];

    // Placeholder data for recently viewed
    const recentlyViewed = [
        { id: '1', title: 'Baldur\'s Gate 3', genre: ['RPG', 'Fantasy'], image: 'https://via.placeholder.com/300x169' },
        { id: '2', title: 'Starfield', genre: ['RPG', 'Sci-Fi'], image: 'https://via.placeholder.com/300x169' },
        { id: '3', title: 'Hogwarts Legacy', genre: ['Action', 'Adventure'], image: 'https://via.placeholder.com/300x169' },
    ];

    // Placeholder data for recommendations
    const recommendedGames = [
        { id: '1', title: 'Red Dead Redemption 2', rating: 4.5, price: 24.99, image: 'https://via.placeholder.com/300x169' },
        { id: '2', title: 'God of War', rating: 5, price: 19.99, image: 'https://via.placeholder.com/300x169' },
        { id: '3', title: 'Horizon Zero Dawn', rating: 4.5, price: 14.99, image: 'https://via.placeholder.com/300x169' },
    ];

    return (
        <div className={styles.container}>
            {/* Header with Back Button */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>
                        Welcome back, {user.name}! Here's what's new
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    <span>←</span> Back to Home
                </button>
            </div>

            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                {/* Wishlist Items Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <h3 className={styles.statCardTitle}>Wishlist Items</h3>
                        <span className={styles.statCardIcon}>❤️</span>
                    </div>
                    <div className={styles.statCardValue}>
                        {stats.wishlistItems}
                    </div>
                    <p className={styles.statCardSubtext}>
                        +2 from last month
                    </p>
                </div>

                {/* Price Drops Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <h3 className={styles.statCardTitle}>Price Drops</h3>
                        <span className={styles.statCardIcon}>📉</span>
                    </div>
                    <div className={styles.statCardValue}>
                        {stats.priceDrops}
                    </div>
                    <p className={styles.statCardSubtext}>
                        Active deals now
                    </p>
                </div>

                {/* Total Saved Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <h3 className={styles.statCardTitle}>Total Saved</h3>
                        <span className={styles.statCardIcon}>🛒</span>
                    </div>
                    <div className={styles.statCardValue}>
                        ${stats.totalSaved}
                    </div>
                    <p className={styles.statCardSubtext}>
                        This year
                    </p>
                </div>

                {/* Games Tracked Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <h3 className={styles.statCardTitle}>Games Tracked</h3>
                        <span className={styles.statCardIcon}>⭐</span>
                    </div>
                    <div className={styles.statCardValue}>
                        {stats.gamesTracked}
                    </div>
                    <p className={styles.statCardSubtext}>
                        All time
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className={styles.twoColumnLayout}>
                {/* Recent Price Drops */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Price Drops</h2>
                        <button className={styles.ghostButton}>
                            View All
                        </button>
                    </div>
                    <div className={styles.priceDropsList}>
                        {priceDrops.map((drop) => (
                            <div
                                key={drop.id}
                                className={styles.priceDropItem}
                            >
                                <img
                                    src={drop.image}
                                    alt={drop.title}
                                    className={styles.priceDropImage}
                                />
                                <div className={styles.priceDropContent}>
                                    <h4 className={styles.priceDropTitle}>
                                        {drop.title}
                                    </h4>
                                    <div className={styles.priceDropPrices}>
                                        <span className={styles.priceOld}>
                                            ${drop.oldPrice}
                                        </span>
                                        <span className={styles.priceNew}>
                                            ${drop.newPrice}
                                        </span>
                                        <span className={styles.discountBadge}>
                                            -{drop.discount}%
                                        </span>
                                    </div>
                                    <p className={styles.priceDropTime}>
                                        {drop.timeAgo}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Favorite Store Performance */}
                <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>Favorite Store Performance</h2>
                    <p className={styles.sectionSubtitle}>
                        Steam - Your preferred store
                    </p>
                    <div className={styles.progressSection}>
                        {/* Progress Bar 1 */}
                        <div className={styles.progressItem}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Best deals this month</span>
                                <span className={styles.progressValue}>87%</span>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div className={`${styles.progressBar} ${styles.progressBarBlue}`} style={{ width: '87%' }} />
                            </div>
                        </div>
                        {/* Progress Bar 2 */}
                        <div className={styles.progressItem}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Price competitiveness</span>
                                <span className={styles.progressValue}>72%</span>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div className={`${styles.progressBar} ${styles.progressBarGreen}`} style={{ width: '72%' }} />
                            </div>
                        </div>
                        {/* Progress Bar 3 */}
                        <div className={styles.progressItem}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Games availability</span>
                                <span className={styles.progressValue}>95%</span>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div className={`${styles.progressBar} ${styles.progressBarOrange}`} style={{ width: '95%' }} />
                            </div>
                        </div>
                    </div>
                    <button className={styles.outlineButton}>
                        Change Favorite Store
                    </button>
                </div>
            </div>

            {/* Recently Viewed */}
            <div className={styles.sectionCard} style={{ marginBottom: '30px' }}>
                <h2 className={styles.sectionTitle}>Recently Viewed</h2>
                <div className={styles.gamesGrid}>
                    {recentlyViewed.map((game) => (
                        <div
                            key={game.id}
                            className={styles.gameCard}
                        >
                            <div className={styles.gameImageContainer}>
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className={styles.gameImage}
                                />
                            </div>
                            <h4 className={styles.gameTitle}>
                                {game.title}
                            </h4>
                            <div className={styles.genreTags}>
                                {game.genre.slice(0, 2).map((genre, idx) => (
                                    <span
                                        key={idx}
                                        className={styles.genreTag}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended for You */}
            <div className={styles.sectionCard} style={{ marginBottom: '30px' }}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 className={styles.sectionTitle}>Recommended for You</h2>
                        <p className={styles.sectionSubtitle} style={{ margin: 0 }}>
                            Based on your purchase history and wishlist
                        </p>
                    </div>
                    <button className={styles.ghostButton}>
                        Refresh
                    </button>
                </div>
                <div className={styles.gamesGrid}>
                    {recommendedGames.map((game) => (
                        <div
                            key={game.id}
                            className={styles.gameCard}
                        >
                            <div className={styles.gameImageContainer}>
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className={styles.gameImage}
                                />
                            </div>
                            <h4 className={styles.gameTitle}>
                                {game.title}
                            </h4>
                            <div className={styles.gameRatingPrice}>
                                <div className={styles.starRating}>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`${styles.star} ${i < Math.floor(game.rating) ? styles.starFilled : styles.starEmpty}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className={styles.gamePrice}>
                                    ${game.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Info Card */}
            <div className={styles.profileCard}>
                <h2 className={styles.profileTitle}>Your Profile</h2>
                <div className={styles.profileGrid}>
                    <div className={styles.profileField}>
                        <p className={styles.profileLabel}>Email</p>
                        <p className={styles.profileValue}>{user.email}</p>
                    </div>
                    <div className={styles.profileField}>
                        <p className={styles.profileLabel}>Role</p>
                        <p className={styles.profileValue}>
                            {user.role.toUpperCase()}
                        </p>
                    </div>
                    <div className={styles.profileField}>
                        <p className={styles.profileLabel}>Status</p>
                        <p className={`${styles.profileValue} ${user.status === 'active' ? styles.statusActive : styles.statusSuspended}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </p>
                    </div>
                    <div className={styles.profileField}>
                        <p className={styles.profileLabel}>Total Purchases</p>
                        <p className={styles.profileValue}>
                            {user.purchase}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
