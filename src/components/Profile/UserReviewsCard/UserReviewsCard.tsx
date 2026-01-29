/**
 * UserReviewsCard Component
 * Displays the reviews written by the current user
 */

import React, { useState, useEffect } from 'react';
import { getUserReviews, deleteReview } from '../../../services/apis/reviews';
import { toast } from 'react-toastify';
import styles from './UserReviewsCard.module.scss';

interface UserReviewsCardProps {
    userId: number;
}

interface UserReview {
    id: number;
    star: number;
    comment: string;
    game: string;
}

export const UserReviewsCard: React.FC<UserReviewsCardProps> = ({ userId }) => {
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getUserReviews(userId);
                setReviews(data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [userId]);

    const handleDelete = async (reviewId: number) => {
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter(r => r.id !== reviewId));
            toast.success('Review deleted');
        } catch (error) {
            toast.error('Failed to delete review');
            console.error('Failed to delete review:', error);
        }
    };

    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating);
    };

    if (loading) {
        return (
            <div className={styles.card}>
                <h3 className={styles.title}>My Reviews</h3>
                <div className={styles.loading}>Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>My Reviews</h3>
            <p className={styles.subtitle}>{reviews.length} review{reviews.length !== 1 ? 's' : ''} written</p>
            
            {reviews.length === 0 ? (
                <div className={styles.empty}>No reviews yet</div>
            ) : (
                <div className={styles.reviewsList}>
                    {reviews.map((review) => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.gameName}>{review.game}</span>
                                <span className={styles.stars}>{renderStars(review.star)}</span>
                                <button 
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(review.id)}
                                    title="Delete review"
                                >
                                    🗑️
                                </button>
                            </div>
                            {review.comment && (
                                <p className={styles.comment}>{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
