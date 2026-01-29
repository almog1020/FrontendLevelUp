import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Rating,
    Button,
    IconButton,
} from "@mui/material";
import styles from "./AddReview.module.scss";
import type {ReviewDialogProps} from "../../interfaces/review.interface.ts";
import {useState} from "react";
import {create_review} from "../../services/apis/reviews.ts";
import {toast} from "react-toastify";
import {getMe} from "../../services/apis/users.ts";



export default function AddReview({open, gameTitle, onClose}: ReviewDialogProps) {

    const [star, setStar] = useState<number | null>(1);
    const [comment, setComment] = useState("");


    const handleSubmit = async () => {
        if (!star) return;
        try {
            const token = localStorage.getItem("token") ?? "guest"
            const signInAction = localStorage.getItem("signInAction") ?? "password"
            const userId = token === "guest" ? null : (await getMe(token, signInAction)).id
            await create_review(star,comment,gameTitle,userId)
            toast.success("Review added successfully.")
            setStar(1);
            setComment("");
            onClose();
        } catch (error:unknown) {
            toast.error((error as Error).message);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            classes={{ paper: styles.dialog }}
        >
            <DialogTitle className={styles.title}>
                Review for {gameTitle}
                <IconButton
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label="close">
                    ×
                </IconButton>
            </DialogTitle>

            <DialogContent className={styles.content}>
                <Box className={styles.section}>
                    <Typography className={styles.label}>Your Rating</Typography>

                    <Rating
                        value={star}
                        onChange={(_, value) => setStar(value)}
                        size="large"
                        className={styles.rating}
                    />
                </Box>

                <Box className={styles.section}>
                    <Typography className={styles.label}>Your Review</Typography>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        cols={30}
                        className={styles.textarea}
                        placeholder="Write a Review"
                        required={true}
                    />
                </Box>
            </DialogContent>

            <DialogActions className={styles.actions}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    className={styles.submitBtn}
                >
                    Submit Review
                </Button>
            </DialogActions>
        </Dialog>
    );
}
