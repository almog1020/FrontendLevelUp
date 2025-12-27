import styles from './GameCardSkeleton.module.scss';

export const GameCardSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__image} />
      <div className={styles.skeleton__content}>
        <div className={styles.skeleton__title} />
        <div className={styles.skeleton__price} />
      </div>
    </div>
  );
};

