import styles from "../Users.module.scss";

export function ActionButton({icon,title}:{icon:string,title:string}) {
    return (
        <button className={styles.iconButton} title={title}>
            <img src= {icon} alt={title} className={styles.icon}/>
        </button>
    )
}