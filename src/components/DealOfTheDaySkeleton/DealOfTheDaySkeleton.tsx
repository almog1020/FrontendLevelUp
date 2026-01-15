import { Skeleton } from '../Skeleton/Skeleton';
import styles from './DealOfTheDaySkeleton.module.scss';

export const DealOfTheDaySkeleton = () => {
  return (
    <section className={styles.dealOfTheDaySkeleton}>
      <div className={styles.dealOfTheDaySkeleton__header}>
        <div className={styles.dealOfTheDaySkeleton__headerContent}>
          <Skeleton width={32} height={32} borderRadius="4px" />
          <div>
            <Skeleton width={200} height={28} borderRadius="4px" />
            <Skeleton width={250} height={14} borderRadius="4px" className={styles.dealOfTheDaySkeleton__subtitle} />
          </div>
        </div>
      </div>

      <div className={styles.dealOfTheDaySkeleton__card}>
        <div className={styles.dealOfTheDaySkeleton__imageContainer}>
          <Skeleton width="100%" height="100%" borderRadius="12px" />
        </div>

        <div className={styles.dealOfTheDaySkeleton__content}>
          <Skeleton width="80%" height={32} borderRadius="4px" />
          <Skeleton width="100%" height={60} borderRadius="4px" />
          <div className={styles.dealOfTheDaySkeleton__genres}>
            <Skeleton width={80} height={28} borderRadius="6px" />
            <Skeleton width={80} height={28} borderRadius="6px" />
            <Skeleton width={80} height={28} borderRadius="6px" />
          </div>
          <div className={styles.dealOfTheDaySkeleton__pricing}>
            <Skeleton width={120} height={32} borderRadius="4px" />
            <Skeleton width={80} height={20} borderRadius="4px" />
          </div>
          <Skeleton width={150} height={48} borderRadius="10px" />
        </div>
      </div>
    </section>
  );
};

