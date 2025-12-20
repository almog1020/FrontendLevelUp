import styles from "./Users.module.scss";
import {ActionButton} from "./ActionButton/ActionButton.tsx";
import editStatus from '../../../assets/editStatus.png'
import protectButton from '../../../assets/protectButton.png'
import deleteButton from '../../../assets/deleteButton.png'
import search from '../../../assets/search.png'
import type {User} from "../../../interfaces/user.interface.ts";
import {useMemo, useState} from "react";
import {deleteUser, updateUser} from "../../../services/apis/users.ts";
import {toast} from "react-toastify";

function Users({users}: {users: User[]}) {
    const [text,setText] = useState<string>('');

    const usersFilter = useMemo(() => {
        if(text)
            return users.filter(user => user.name.toLowerCase().includes(text))
        return users
    }, [text,users]);

    const handleDelete = async (index:number) => {
        try {
            await deleteUser(users[index].email)
            toast.success("User Deleted Successfully!");
        }catch(e){
            toast.error((e as Error).message);
        }
    }
    const handleUpdate = async (index:number,fieldName:keyof User) => {
        try {
            const editUser = {...users[index]};
            if(fieldName === 'role')
                editUser.role = users[index].role === 'admin' ? 'user' : 'admin'

            if(fieldName === 'status')
                editUser.status = users[index].status === 'suspended' ? 'active' : 'suspended'

            await updateUser(users[index].email,editUser)

        }catch (e) {
            toast.error((e as Error).message);
        }
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
                        onChange={(event) => setText(event.target.value)}
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
                    <th>Purchases</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {usersFilter.map((user,index:number) => (
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
                        <td className={styles.purchase}>{user.purchase}</td>

                        <td>
                            <div className={styles.actions}>
                                <ActionButton icon={editStatus} title={'role'} onClick={handleUpdate} index={index}/>
                                <ActionButton icon={protectButton} title={'status'} onClick={handleUpdate} index={index}/>
                                <ActionButton icon={deleteButton} title={'delete'} onClick={handleDelete} index={index} />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default Users;