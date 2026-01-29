import { useState } from 'react';
import { toast } from 'react-toastify';
import { triggerETL } from '../../services/apis/games';
import styles from './ETLTrigger.module.scss';
import 'react-toastify/dist/ReactToastify.css';

interface ETLTriggerProps {
  onSuccess?: () => void;
  searchTerm?: string;
}

export const ETLTrigger = ({ onSuccess, searchTerm }: ETLTriggerProps) => {
  const [loading, setLoading] = useState(false);

  const handleTriggerETL = async () => {
    try {
      setLoading(true);
      const result = await triggerETL(searchTerm);
      
      toast.success(
        `ETL completed! Processed ${result.games_processed} games and ${result.prices_processed} prices.`,
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger ETL';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={styles.etlTrigger}
        onClick={handleTriggerETL}
        disabled={loading}
        aria-label="Trigger ETL pipeline to fetch game data"
      >
        {loading ? (
          <>
            <span className={styles.etlTrigger__spinner} />
            Processing...
          </>
        ) : (
          <>
            <span className={styles.etlTrigger__icon}>🔄</span>
            {searchTerm ? 'Search Games' : 'Refresh Game Data'}
          </>
        )}
      </button>
    </>
  );
};

