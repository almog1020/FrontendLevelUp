import { useNavigate } from "react-router-dom";
import styles from "../GameManagement.module.scss";

export function GameManagementHeader() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Game Management</h1>
      </div>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate("/admin")}
      >
        Back to dashboard
      </button>
    </header>
  );
}

