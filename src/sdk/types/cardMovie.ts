export type CardMovie = {
    id: number,
    name: string,
    alternativeName: string,
    year: number,
    rating: {
        kp: number,
        imdb: number,
    },
    poster: {
        url: string,
    },
    countries: {name: string}[],
    top250: number,
    genres: {name: string}[],
};
