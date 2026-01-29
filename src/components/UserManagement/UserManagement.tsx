import * as React from "react";
import styles from "./UserManagement.module.scss";
import StatCard from "../StatCard/StatCard.tsx";
import Users from "./Users/Users.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import type {User} from "../../interfaces/user.interface.ts";
import user from "../../assets/users.png";
import activeUser from "../../assets/activeUsers.png";
import suspendedUsers from "../../assets/suspendedUsers.png";
import admin from "../../assets/admin.png";
import type {StatsCard} from "../../interfaces/statsCard.interface.ts";
import {API_BASE_URL} from "../../services/apis/config.ts";
import {CircularProgress} from "@mui/material";


const UserManagement: React.FC = () => {
    const [users,setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${API_BASE_URL}/users/ws`);
        wsRef.current = ws;

        ws.onopen = () => console.log("WebSocket connected");
        ws.onmessage = (e) => {
            setTimeout(() => {
                setLoading(false)
                setUsers(JSON.parse(e.data))
            }, 2000);
        };
        ws.onerror = (e) => console.log("WebSocket error", e);
        ws.onclose = () => console.log("WebSocket closed");

        // runs ONLY when app/page actually unmounts
        return () => {
            ws.close(1000, "component unmounted");
            wsRef.current = null;
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