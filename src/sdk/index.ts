import { baseUrl } from './hosts';
import axios from 'axios';
import { User } from './types/users';
import { Company, GetCompaniesParams, CompanyComment } from './types/company';

export const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    }

})
export const sdk = {
    login: async (username: string, password: string): Promise<{data: {token: string}}> => {
        return await instance.post('/login', { username, password });
    },
    register: async (username: string, password: string): Promise<{data: {token: string}}> => {
        return await instance.post('/signup', { username, password });
    },
    getUserInfo: async (): Promise<{data: User}> => {
        return await instance.get('/user');
    },
    getCompanies: async ({startDate, endDate, userId}: GetCompaniesParams): Promise<{data: {companies: Company[]}}> => {
        return await instance.get('/companies', {params: {startDate, endDate, userId}});
    },
    getClients: async () => {
        return await instance.get('/clients');
    },
    getCompanyComments: async (companyId: string): Promise<{data: CompanyComment[]}> => {
        return await instance.get(`/companies/${companyId}/comments`);
    },
    addCompanyComment: async (companyId: string, text: string): Promise<{data: CompanyComment}> => {
        return await instance.post(`/companies/${companyId}/comments`, { text });
    }
}
