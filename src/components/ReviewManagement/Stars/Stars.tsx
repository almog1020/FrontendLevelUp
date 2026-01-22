import styles from './Stars.module.scss'

export default function Stars({ value }: { value: number }) {
    return (
        <div className={styles.stars}>
            {Array.from({ length: value }).map((_, i) => (
                <span
                    key={i}
                    className={`${styles.star} ${i < value ? styles.starFilled : styles.starEmpty}`}>★</span>
            ))}
        </div>
    );
}