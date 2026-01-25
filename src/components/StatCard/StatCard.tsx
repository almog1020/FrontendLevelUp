import styles from "./StatCard.module.scss";
import * as React from "react";
import type {StatsCard} from "../../interfaces/statsCard.interface.ts";

const StatCard: React.FC<StatsCard> = ({value,icon,title}) => {
    return (
        <div className={styles.card}>
            <div className={styles.label}>{title}</div>
            <div className={styles.valueRow}>
                <img src= {icon} alt={title} className={styles.icon}/>
                <span className={styles.value}>{value}</span>
            </div>
        </div>
    )
}
export default StatCard;