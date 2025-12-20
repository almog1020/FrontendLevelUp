import styles from "../Users.module.scss";

export function ActionButton({icon,title,index,onClick}:{icon:string,title:string,index:number,onClick(index:number,fieldName:string):void}) {
    const handleClick = () => {

        if(title === "role")
            onClick(index,title);

        if(title === "status")
            onClick(index,title);
    }
    return (
        <button className={styles.iconButton} title={title} onClick={handleClick}>
            <img src= {icon} alt={title} className={styles.icon}/>
        </button>
    )
}