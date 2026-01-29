import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastPurchases, type Purchase } from '../../services/apis/games';
import styles from './UserDashboard.module.scss';
import { LastPurchases, type LastPurchaseGame } from './LastPurchases/LastPurchases';
import { RecommendedGames, type RecommendedGame } from './RecommendedGames/RecommendedGames';

export const UserDashboard = () => {
    const [lastPurchases, setLastPurchases] = useState<LastPurchaseGame[]>([]);
    const [loadingPurchases, setLoadingPurchases] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch last purchases when component mounts
        getLastPurchases(10)
            .then((purchases: Purchase[]) => {
                // Convert Purchase objects to LastPurchaseGame format
                const convertedPurchases: LastPurchaseGame[] = purchases.map((purchase) => ({
                    id: purchase.game_id,
                    title: purchase.game_title,
                    genre: purchase.game_genre
                        ? purchase.game_genre.split(',').map((g: string) => g.trim())
                        : [],
                    image: purchase.game_image_url || ''
                }));
                setLastPurchases(convertedPurchases);
                setLoadingPurchases(false);
            })
            .catch((err: unknown) => {
                console.error('Failed to fetch purchases:', err);
                setLastPurchases([]);
                setLoadingPurchases(false);
            });
    }, []);

    // Placeholder stats (will connect to backend later)
    const stats = {
        wishlistItems: 12,
        priceDrops: 3,
        totalSaved: 127,
        gamesTracked: 47
    };

    // Stat cards data array - DRY approach
    const statCards = [
        {
            title: 'Wishlist Items',
            value: stats.wishlistItems,
            icon: '❤️',
            subtext: '+2 from last month'
        },
        {
            title: 'Price Drops',
            value: stats.priceDrops,
            icon: '📉',
            subtext: 'Active deals now'
        },
        {
            title: 'Total Saved',
            value: `$${stats.totalSaved}`,
            icon: '🛒',
            subtext: 'This year'
        },
        {
            title: 'Games Tracked',
            value: stats.gamesTracked,
            icon: '⭐',
            subtext: 'All time'
        }
    ];

    // Placeholder data for price drops
    const priceDrops = [
        { id: '1', title: 'Cyberpunk 2077', oldPrice: 59.99, newPrice: 29.99, discount: 50, image: 'https://via.placeholder.com/80', timeAgo: '2 hours ago' },
        { id: '2', title: 'Elden Ring', oldPrice: 59.99, newPrice: 19.99, discount: 67, image: 'https://via.placeholder.com/80', timeAgo: '5 hours ago' },
        { id: '3', title: 'The Witcher 3', oldPrice: 39.99, newPrice: 9.99, discount: 75, image: 'https://via.placeholder.com/80', timeAgo: '1 day ago' },
    ];


    // Placeholder data for recommendations
    const recommendedGames: RecommendedGame[] = [
        { id: '1', title: 'Red Dead Redemption 2', rating: 4.5, price: 24.99, image: 'https://via.placeholder.com/300x169' },
        { id: '2', title: 'God of War', rating: 5, price: 19.99, image: 'https://via.placeholder.com/300x169' },
        { id: '3', title: 'Horizon Zero Dawn', rating: 4.5, price: 14.99, image: 'https://via.placeholder.com/300x169' },
    ];

    // Store performance metrics
    const storeMetrics = [
        { label: 'Best deals this month', value: 87, color: 'blue' },
        { label: 'Price competitiveness', value: 72, color: 'green' },
        { label: 'Games availability', value: 95, color: 'orange' },
    ];

    return (
        <div className={styles.container}>
            {/* Header with Back Button */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Dashboard</h1>
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
                {statCards.map((statCard, index: number) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statCardHeader}>
                            <h3 className={styles.statCardTitle}>{statCard.title}</h3>
                            <span className={styles.statCardIcon}>{statCard.icon}</span>
                        </div>
                        <div className={styles.statCardValue}>
                            {statCard.value}
                        </div>
                        <p className={styles.statCardSubtext}>
                            {statCard.subtext}
                        </p>
                    </div>
                ))}
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
                        {storeMetrics.map((metric, index) => {
                            const colorClass = `progressBar${metric.color.charAt(0).toUpperCase() + metric.color.slice(1)}`;
                            return (
                                <div key={index} className={styles.progressItem}>
                                    <div className={styles.progressHeader}>
                                        <span className={styles.progressLabel}>{metric.label}</span>
                                        <span className={styles.progressValue}>{metric.value}%</span>
                                    </div>
                                    <div className={styles.progressBarContainer}>
                                        <div 
                                            className={`${styles.progressBar} ${styles[colorClass]}`} 
                                            style={{ width: `${metric.value}%` }} 
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button className={styles.outlineButton}>
                        Change Favorite Store
                    </button>
                </div>
            </div>

            {/* Last Purchases */}
            {loadingPurchases ? (
                <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>Last Purchases</h2>
                    <p>Loading...</p>
                </div>
            ) : (
                <LastPurchases games={lastPurchases} />
            )}

            {/* Recommended for You */}
            <RecommendedGames games={recommendedGames} />
        </div>
    );
};
