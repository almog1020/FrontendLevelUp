import * as React from "react";
import styles from "./UserManagement.module.scss";
import StatCard from "../StatCard/StatCard.tsx";
import Users from "./Users/Users.tsx";
import {useEffect, useMemo, useState} from "react";
import type {User} from "../../interfaces/user.interface.ts";
import user from "../../assets/users.png";
import activeUser from "../../assets/activeUsers.png";
import suspendedUsers from "../../assets/suspendedUsers.png";
import admin from "../../assets/admin.png";
import type {StatsCard} from "../../interfaces/statsCard.interface.ts";
import {CircularProgress} from "@mui/material";
import {getUsers} from "../../services/apis/users.ts";
import {toast} from "react-toastify";


const UserManagement: React.FC = () => {
    const [users,setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        let alive = true;

        const fetchReviews = async () => {
            try {
                const users = await getUsers()
                if (alive) setUsers(users);
                setLoading(false)
            } catch (e:unknown) {
                setLoading(false)
                toast.error((e as Error).message)
            }
        };
        const id = setInterval(fetchReviews, 2000);

        return () => {
            alive = false;
            clearInterval(id);
        };
    }, []);
    
    const statCards:StatsCard[] = useMemo(() => {
        return [
            {
                title:'Total Users',
                value:users.length,
                icon:user
            },
            {
                title:'Active Users',
                value:users.filter(user=>user.status == "active").length,
                icon:activeUser
            },
            {
                title:'Suspended',
                value:users.filter(user=>user.status == "suspended").length,
                icon:suspendedUsers
            },
            {
                title:'Admins',
                value:users.filter(user=>user.role == "admin").length,
                icon:admin
            }
        ]
    },[users])

    return (
        <section className={styles.userOverview}>
            <div className={styles.headerRow}>
                <div>
                    <h2 className={styles.title}>Users Management</h2>
                    <p className={styles.subtitle}>
                        Manage platform users and their permissions
                    </p>
                </div>
            </div>

            <div className={styles.cardsRow}>
                {statCards.map((statCard,index:number) =>
                    <StatCard title={statCard.title} value={statCard.value} icon={statCard.icon} key={index}/>
                )}
            </div>
            <div className={styles.contentRow}>
                {loading ? <CircularProgress className={styles.loading} /> :<Users users={users} setLoading={setLoading}/>}
            </div>
        </section>
    );
};

export default UserManagement;