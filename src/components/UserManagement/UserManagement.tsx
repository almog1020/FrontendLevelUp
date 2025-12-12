import * as React from "react";
import styles from "./UserManagement.module.scss";
import StatCard from "./StatCard/StatCard.tsx";
import {statCards} from "../../consts/statCard.const.ts";
import Users from "./Users/Users.tsx";


const UserManagement: React.FC = () => {
    return (
        <section className={styles.userOverview}>
            <div className={styles.headerRow}>
                <div>
                    <h2 className={styles.title}>User Management</h2>
                    <p className={styles.subtitle}>
                        Manage platform users and their permissions
                    </p>
                </div>

                <button className={styles.addUserButton}>
                    <span className={styles.addUserIcon}>👤</span>
                    <span>Add User</span>
                </button>
            </div>

            <div className={styles.cardsRow}>
                {statCards.map((statCard,index:number) =>
                    <StatCard title={statCard.title} value={statCard.value} icon={statCard.icon} key={index}/>
                )}
            </div>
            <Users/>
        </section>
    );
};

export default UserManagement;