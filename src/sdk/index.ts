import { CardMovie } from './types/cardMovie';
import { baseUrl } from './hosts';
import axios from 'axios';
import { Movie } from './types/movie';
import { Review } from './types/review';
import { User } from './types/users';
import { Company, GetCompaniesParams } from './types/company';

export const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    }

})
export const sdk = {
    getMovies: async (search?: string): Promise<{data: CardMovie[]}> => {
        return await instance.get('/movies', {
            params: { search },
        });
    },
    getMovie: async (id: string): Promise<{data: Movie}> => {
        return await instance.get('/movie', {
            params: { id }
        })
    },
    getReviews: async (movieId: number): Promise<{data: Review[]}> => {
        return await instance.get('/reviews',{
            params: { movieId },
        })
    },
    login: async (username: string, password: string): Promise<{data: {token: string}}> => {
        return await instance.post('/login', { username, password });
    },
    register: async (username: string, password: string): Promise<{data: {token: string}}> => {
        return await instance.post('/signup', { username, password });
    },
    getUserInfo: async (): Promise<{data: User}> => {
        return await instance.get('/user');
    },
    postReview: async (title: string, review: string, movieId: string, type?: string) => {
        return await instance.post('/reviews', { title, review, movieId, type });
    },
    willWatch: async (movieId: string) => {
        return await instance.post('/willwatch', { movieId });
    },
    watched: async (movieId: string) => {
        return await instance.post('/watched', { movieId });
    },
    estimate: async (movieId: string, estimate?: string) => {
        return await instance.post('/estimate', { movieId, estimate });
    },
    getCompanies: async ({startDate, endDate, userId}: GetCompaniesParams): Promise<{data: {companies: Company[]}}> => {
        return await instance.get('/companies', {params: {startDate, endDate, userId}});
    },
    getClients: async () => {
        return await instance.get('/clients');
    }
}
