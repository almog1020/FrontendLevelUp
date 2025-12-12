import * as React from "react";
import styles from "./Users.module.scss";
import {usersTemp} from "../../../consts/users.const.ts";
import {ActionButton} from "./ActionButton/ActionButton.tsx";
import editButton from '../../../assets/editButton.png'
import protectButton from '../../../assets/protectButton.png'
import deleteButton from '../../../assets/deleteButton.png'
import search from '../../../assets/search.png'
import type {User} from "../../../interfaces/user.interface.ts";

const Users: React.FC = () => {
    const [users, setUsers] = React.useState<User[]>(usersTemp)
    const handleUsersFilter = (text:string) => {
        if (text)
            setUsers(users.filter(user => user.name.toLowerCase().includes(text)))
        else
            setUsers(usersTemp)
    }
    return (
        <section className={styles.allUsers}>
            <div className={styles.topRow}>
                <div>
                    <h3 className={styles.title}>All Users</h3>
                    <p className={styles.subtitle}>A list of all users in the system</p>
                </div>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>
                        <img src={search} alt="search icon" className={styles.icon}/>
                    </span>
                    <input
                        className={styles.searchInput}
                        placeholder="Search users..."
                        onChange={(event) => handleUsersFilter(event.target.value)}
                    />
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Active</th>
                    <th>Wishlist</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr>
                        <td>
                            <div className={styles.userCell}>
                                <div className={styles.avatar}>
                                    {user.name.charAt(0)}
                                </div>
                                <div className={styles.userText}>
                                    <div className={styles.userName}>{user.name}</div>
                                    <div className={styles.userEmail}>{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span
                                className={
                                    user.role === "admin"
                                        ? `${styles.badge} ${styles.badgeAdmin}`
                                        : `${styles.badge} ${styles.badgeUser}`
                                }>
                              {user.role}
                            </span>
                        </td>
                        <td>
                            <span
                                className={
                                    user.status === "active"
                                        ? `${styles.badge} ${styles.badgeActive}`
                                        : `${styles.badge} ${styles.badgeSuspended}`
                                }>
                              {user.status}
                            </span>
                        </td>

                        <td>{user.joined}</td>
                        <td>{user.lastActive}</td>
                        <td className={styles.wishlist}>{user.wishlist}</td>

                        <td>
                            <div className={styles.actions}>
                                <ActionButton icon={editButton} title={'Edit'}/>
                                <ActionButton icon={protectButton} title={'Protect'}/>
                                <ActionButton icon={deleteButton} title={'Delete'}/>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
};

export default Users;