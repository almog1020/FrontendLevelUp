import type {User} from "./user.interface.ts";

export interface ReviewDialogProps {
    open: boolean;
    gameTitle: string;
    onClose: () => void;
}
export interface Review {
    id: number;
    user_id: number;
    game: string;
    star: number;
    comment: string;
}
export interface ReviewRecord {
    review: Review;
    user: User | null;
}