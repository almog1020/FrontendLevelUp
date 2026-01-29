import { Skeleton } from '../Skeleton/Skeleton';
import styles from './GameDetailSkeleton.module.scss';

export const GameDetailSkeleton = () => {
  return (
    <div className={styles.gameDetailSkeleton}>
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Left Side - Image Gallery */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageContainer}>
              <Skeleton width="100%" height="100%" borderRadius="12px" />
            </div>
          </div>

          {/* Right Side - Game Info */}
          <div className={styles.infoSection}>
            {/* Title */}
            <Skeleton width="80%" height={36} borderRadius="4px" />

            {/* Genre Tags */}
            <div className={styles.genres}>
              <Skeleton width={80} height={28} borderRadius="20px" />
              <Skeleton width={80} height={28} borderRadius="20px" />
              <Skeleton width={80} height={28} borderRadius="20px" />
            </div>

            {/* Price Box */}
            <div className={styles.priceBox}>
              <Skeleton width={100} height={14} borderRadius="4px" />
              <div className={styles.priceBoxContent}>
                <div className={styles.priceRow}>
                  <Skeleton width={120} height={36} borderRadius="4px" />
                  <Skeleton width={80} height={20} borderRadius="4px" />
                </div>
                <Skeleton width={80} height={24} borderRadius="6px" />
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width="100%" height={48} borderRadius="10px" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Skeleton width="100%" height={48} borderRadius="10px" />
              <Skeleton width={48} height={48} borderRadius="10px" />
            </div>

            {/* Game Details */}
            <div className={styles.gameDetails}>
              <div className={styles.detailRow}>
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width={120} height={14} borderRadius="4px" />
              </div>
              <div className={styles.detailRow}>
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width={60} height={14} borderRadius="4px" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tabs */}
        <div className={styles.tabsSection}>
          <div className={styles.tabs}>
            <Skeleton width={120} height={48} borderRadius="4px" />
            <Skeleton width={150} height={48} borderRadius="4px" />
            <Skeleton width={100} height={48} borderRadius="4px" />
          </div>

          <div className={styles.tabContent}>
            <Skeleton width={200} height={32} borderRadius="4px" />
            <Skeleton width="100%" height={16} borderRadius="4px" className={styles.descriptionLine} />
            <Skeleton width="95%" height={16} borderRadius="4px" className={styles.descriptionLine} />
            <Skeleton width="90%" height={16} borderRadius="4px" className={styles.descriptionLine} />
            <Skeleton width="98%" height={16} borderRadius="4px" className={styles.descriptionLine} />
            <Skeleton width="85%" height={16} borderRadius="4px" className={styles.descriptionLine} />
          </div>
        </div>
      </main>
    </div>
  );
};
