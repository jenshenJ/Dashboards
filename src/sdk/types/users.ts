import type { Review } from "./review";

export type User = {
    _id: string,
    isAdmin?: boolean;
    username: string,
    reviews: Review[],
    willWatch: string[],
    watched: string[],
    estimations: { movieId: string, estimate: string}[],
}