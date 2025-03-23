import { CardMovie } from "./cardMovie";

export type Movie = {
    description: string,
    videos: {
        trailers: { url: string }[],
    },
    slogan: string,
    movieLength: number,
    backdrop: { url: string },
} & CardMovie;
