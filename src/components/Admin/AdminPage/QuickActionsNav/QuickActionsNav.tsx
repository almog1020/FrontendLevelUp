import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Gamepad2, Store, MessageSquare } from "lucide-react";
import styles from "./QuickActionsNav.module.scss";

const QuickActionsNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Quick Actions</h3>
      </div>

      <div className={styles.grid}>
        <button type="button" className={styles.actionBtn} onClick={() => navigate("/admin/users")}>
          <Users className={styles.icon} />
          Manage Users
        </button>

        <button type="button" className={styles.actionBtn} onClick={() => navigate("/admin/games")}>
          <Gamepad2 className={styles.icon} />
          Manage Games
        </button>

        <button type="button" className={styles.actionBtn} onClick={() => navigate("/admin/stores")}>
          <Store className={styles.icon} />
          Manage Stores
        </button>

        <button type="button" className={styles.actionBtn} onClick={() => navigate("/admin/reviews")}>
          <MessageSquare className={styles.icon} />
          Review Moderation
        </button>
      </div>
    </section>
  );
};

export default QuickActionsNav;

