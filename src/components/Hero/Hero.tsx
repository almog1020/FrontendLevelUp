import styles from './Hero.module.scss';

export const Hero = () => {
  const handleBrowseGames = () => {
    console.log('Browse games clicked');
    // Future: Navigate to games page or scroll to games section
  };

  return (
    <section className={styles.hero}>
      <div className={styles.hero__container}>
        <div className={styles.hero__badge}>
          <span className={styles.hero__badgeIcon}>🚀</span>
          <span className={styles.hero__badgeText}>Your Ultimate Game Price Tracker</span>
        </div>
        <h2 className={styles.hero__title}>
          Compare Prices Across All Stores
        </h2>
        <p className={styles.hero__description}>
          Find the best deals on PC games from Steam, Epic, G2A, and more. Track prices, build wishlists, and never miss a sale again.
        </p>
        <button className={styles.hero__cta} onClick={handleBrowseGames}>
          Browse Games
        </button>
      </div>
    </section>
  );
};

