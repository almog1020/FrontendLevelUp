import { Skeleton } from '../Skeleton/Skeleton';
import styles from './GameDetailSkeleton.module.scss';

export const GameDetailSkeleton = () => {
  return (
    <div className={styles.gameDetailSkeleton}>
      <main className={styles.gameDetailSkeleton__main}>
        <div className={styles.gameDetailSkeleton__content}>
          {/* Left Side - Image Gallery */}
          <div className={styles.gameDetailSkeleton__imageSection}>
            <div className={styles.gameDetailSkeleton__mainImageContainer}>
              <Skeleton width="100%" height="100%" borderRadius="12px" />
            </div>
            <div className={styles.gameDetailSkeleton__thumbnailContainer}>
              <Skeleton width={120} height={80} borderRadius="8px" />
              <Skeleton width={120} height={80} borderRadius="8px" />
              <Skeleton width={120} height={80} borderRadius="8px" />
            </div>
          </div>

          {/* Right Side - Game Info */}
          <div className={styles.gameDetailSkeleton__infoSection}>
            <Skeleton width="80%" height={36} borderRadius="4px" />
            
            {/* Rating */}
            <div className={styles.gameDetailSkeleton__rating}>
              <Skeleton width={100} height={20} borderRadius="4px" />
              <Skeleton width={120} height={14} borderRadius="4px" />
            </div>

            {/* Genre Tags */}
            <div className={styles.gameDetailSkeleton__genres}>
              <Skeleton width={80} height={28} borderRadius="20px" />
              <Skeleton width={80} height={28} borderRadius="20px" />
              <Skeleton width={80} height={28} borderRadius="20px" />
            </div>

            {/* Price Box */}
            <div className={styles.gameDetailSkeleton__priceBox}>
              <Skeleton width={100} height={12} borderRadius="4px" />
              <div className={styles.gameDetailSkeleton__priceBoxContent}>
                <div className={styles.gameDetailSkeleton__priceRow}>
                  <Skeleton width={120} height={36} borderRadius="4px" />
                  <Skeleton width={80} height={20} borderRadius="4px" />
                </div>
                <Skeleton width={80} height={24} borderRadius="6px" />
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width="100%" height={48} borderRadius="10px" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.gameDetailSkeleton__actionButtons}>
              <Skeleton width="100%" height={48} borderRadius="10px" />
              <Skeleton width={48} height={48} borderRadius="10px" />
            </div>

            {/* Game Details */}
            <div className={styles.gameDetailSkeleton__gameDetails}>
              <div className={styles.gameDetailSkeleton__detailRow}>
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width={120} height={14} borderRadius="4px" />
              </div>
              <div className={styles.gameDetailSkeleton__detailRow}>
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width={100} height={16} borderRadius="4px" />
              </div>
              <div className={styles.gameDetailSkeleton__detailRow}>
                <Skeleton width={100} height={14} borderRadius="4px" />
                <Skeleton width={60} height={14} borderRadius="4px" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tabs */}
        <div className={styles.gameDetailSkeleton__tabsSection}>
          <div className={styles.gameDetailSkeleton__tabs}>
            <Skeleton width={120} height={48} borderRadius="4px" />
            <Skeleton width={160} height={48} borderRadius="4px" />
            <Skeleton width={100} height={48} borderRadius="4px" />
          </div>

          <div className={styles.gameDetailSkeleton__tabContent}>
            <Skeleton width="30%" height={24} borderRadius="4px" />
            <Skeleton width="100%" height={16} borderRadius="4px" className={styles.gameDetailSkeleton__descriptionLine} />
            <Skeleton width="100%" height={16} borderRadius="4px" className={styles.gameDetailSkeleton__descriptionLine} />
            <Skeleton width="90%" height={16} borderRadius="4px" className={styles.gameDetailSkeleton__descriptionLine} />
            <Skeleton width="100%" height={16} borderRadius="4px" className={styles.gameDetailSkeleton__descriptionLine} />
            <Skeleton width="85%" height={16} borderRadius="4px" className={styles.gameDetailSkeleton__descriptionLine} />
          </div>
        </div>
      </main>
    </div>
  );
};

