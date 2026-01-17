import { Skeleton } from '../Skeleton/Skeleton';
import styles from './GameCardSkeleton.module.scss';

export const GameCardSkeleton = () => {
  return (
    <div className={styles.gameCardSkeleton}>
      <div className={styles.gameCardSkeleton__imageContainer}>
        <Skeleton width="100%" height="100%" borderRadius="0" />
      </div>
      <div className={styles.gameCardSkeleton__content}>
        <Skeleton width="90%" height={16} borderRadius="4px" />
        <Skeleton width="60%" height={20} borderRadius="4px" />
      </div>
    </div>
  );
};

