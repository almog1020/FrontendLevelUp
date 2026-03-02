import * as React from "react";
import { Link } from "react-router-dom";
import { Users, MessageSquare } from "lucide-react";
import styles from "./QuickActionsNav.module.scss";

const QuickActionsNav: React.FC = () => {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Quick Actions</h3>
      </div>

      <div className={styles.grid}>
        <Link className={styles.actionBtn} to="/admin/management/users">
          <Users className={styles.icon} />
          Manage Users
        </Link>

        {/*<Link className={styles.actionBtn} to="/admin/management/games">*/}
        {/*  <Gamepad2 className={styles.icon} />*/}
        {/*  Manage Games*/}
        {/*</Link>*/}

        <Link className={styles.actionBtn} to="/admin/management/reviews">
          <MessageSquare className={styles.icon} />
          Review Moderation
        </Link>
      </div>
    </section>
  );
};

export default QuickActionsNav;

