import styles from "../AdminPage.module.scss";

export function AdminDashboardHeader() {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Platform overview and management</p>
      </div>
      <span className={styles.badge}>Admin Access</span>
    </header>
  );
}

