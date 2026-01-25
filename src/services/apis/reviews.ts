import {instance} from "./config.ts";
import {AxiosError} from "axios";
import type {ReviewRecord} from "../../interfaces/review.interface.ts";

export async function create_review(star:number,comment:string,game:string,user_id:number | null):Promise<void> {
    try {
        await instance.post('/reviews', {star, comment,game,user_id});
    }catch(e:unknown) {
        if (e instanceof AxiosError)
            throw new Error(e.response!.data.detail);
        throw e;
    }
}
export async function deleteReview(reviewId:number): Promise<void> {
    try {
        await instance.delete(`/reviews/${reviewId}`)
    }catch(e:unknown) {
        if (e instanceof AxiosError)
            throw new Error(e.response!.data.detail);
        throw e;
    }
}
export async function getGameReviews(game:string):Promise<ReviewRecord[]> {
    return (await instance.get(`/reviews/${game}`)).data;
}