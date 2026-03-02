import styles from "./Action.module.scss";

export default function Action({icon,label,onAction}:{icon:string,label:string,onAction():void}) {
    return (
        <>
            <button className={styles.btn} onClick={onAction}>
                <div className={styles.label}>{label}</div>
                <img src={icon} alt={"action"} className={styles.icon}/>
            </button>
        </>
    )
}