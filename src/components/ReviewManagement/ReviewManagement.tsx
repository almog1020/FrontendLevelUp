import {useEffect, useMemo, useState} from "react";
import styles from "./ReviewManagement.module.scss";
import Stars from "../Stars/Stars";
import StatCard from "../General/StatCard/StatCard.tsx";
import type {StatsCard} from "../../interfaces/statsCard.interface.ts";
import starBlue from '../../assets/star-blue.png'
import starGreen from '../../assets/star-green.png'
import starYellow from '../../assets/star-yellow.png'
import deleteIcon from '../../assets/deleteButton.png'
import type {ReviewRecord} from "../../interfaces/review.interface.ts";
import {toast} from "react-toastify";
import {deleteReview, getReviews} from "../../services/apis/reviews.ts";
import {CircularProgress} from "@mui/material";


export default function ReviewManagement() {
    const [results, setResults] = useState<ReviewRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let alive = true;

        const fetchReviews = async () => {
            try {
                const reviews = await getReviews()
                if (alive) setResults(reviews);
                setLoading(false)
            } catch (e: unknown) {
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

    const reviewsCard: StatsCard[] = useMemo(() => {
        const total = results.length;
        return [
            {
                title: "Total Reviews",
                icon: starBlue,
                value: total
            },
            {
                title: "Average Rating",
                icon: starYellow,
                value: total === 0 ? 0 :
                    parseFloat((results.reduce((s, result) => s + result.review.star, 0) / total).toFixed(3))
            },
            {
                title: "5-Star Reviews",
                icon: starGreen,
                value: results.filter((result) => result.review.star === 5).length
            }
        ]
    }, [results]);

    const handleDelete = async (reviewId: number) => {
        try {
            setLoading(true);
            await deleteReview(reviewId)
            toast.success("Review Deleted Successfully!");
        } catch (e) {
            setLoading(false);
            toast.error((e as Error).message);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.topRow}>
                <div>
                    <h1 className={styles.title}>Reviews Management</h1>
                    <p className={styles.subtitle}>Manage all user reviews</p>
                </div>
            </div>

            <div className={styles.cards}>
                {reviewsCard.map(((review, key: number) =>
                    <StatCard icon={review.icon} title={review.title} value={review.value} key={key}/>))}
            </div>
            <div className={styles.contentRow}>
                {loading ? <CircularProgress className={styles.loading}/> :
                    <div className={styles.panel}>
                        <div className={styles.panelTitle}>All Reviews</div>
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Game</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th className={styles.right}>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {results.map((result) => (
                                    <tr key={result.review.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div
                                                    className={styles.userName}>{result.user ? result.user.name : "guest"}</div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className={styles.gameName}>{result.review.game}</div>
                                        </td>

                                        <td>
                                            <Stars value={result.review.star}/>
                                        </td>

                                        <td>
                                            <div className={styles.comment}>
                                                {result.review.comment}
                                            </div>
                                        </td>
                                        <td className={styles.right}>
                                            <button
                                                className={styles.trashBtn}
                                                onClick={() => handleDelete(result.review.id)}
                                            >
                                                <img src={deleteIcon} alt={'delete-review'}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className={styles.empty}>
                                            No reviews yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
