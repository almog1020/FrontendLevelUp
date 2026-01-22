import {instance} from "./config.ts";
import {AxiosError} from "axios";

export async function create_review(star:number,comment:string,game:string):Promise<void> {
    try {
        await instance.post('/reviews', {star, comment,game});
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