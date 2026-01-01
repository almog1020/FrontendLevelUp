import styles from './DealOfTheDaySkeleton.module.scss';

export const DealOfTheDaySkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__header}>
        <div className={styles.skeleton__headerIcon} />
        <div className={styles.skeleton__headerText}>
          <div className={styles.skeleton__title} />
          <div className={styles.skeleton__subtitle} />
        </div>
      </div>
      <div className={styles.skeleton__card}>
        <div className={styles.skeleton__image} />
        <div className={styles.skeleton__content}>
          <div className={styles.skeleton__gameTitle} />
          <div className={styles.skeleton__description} />
          <div className={styles.skeleton__genres} />
          <div className={styles.skeleton__pricing} />
          <div className={styles.skeleton__button} />
        </div>
      </div>
    </div>
  );
};

