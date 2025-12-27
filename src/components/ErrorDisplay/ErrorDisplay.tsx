import styles from './ErrorDisplay.module.scss';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorDisplay = ({ message, onRetry, showRetry = true }: ErrorDisplayProps) => {
  return (
    <div className={styles.errorDisplay}>
      <div className={styles.errorDisplay__icon}>⚠️</div>
      <h3 className={styles.errorDisplay__title}>Something went wrong</h3>
      <p className={styles.errorDisplay__message}>{message}</p>
      {showRetry && onRetry && (
        <button className={styles.errorDisplay__retry} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

