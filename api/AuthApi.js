import { testData } from '../test-data/testData.js';

export class AuthApi {
    constructor(request) {
        this.request = request;
        this.baseURL = 'https://dummyjson.com';
    }

    async login(username, password) {
        return await this.request.post(`${this.baseURL}/auth/login`, {
            data: {
                username,
                password,
                expiresInMins: testData.apiUserCredentials.expiresInMins
            }
        });
    }

    async getCurrentUser(token) {
        return await this.request.get(`${this.baseURL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    async refreshToken(refreshTokenVal) {
        return await this.request.post(`${this.baseURL}/auth/refresh`, {
            data: { 
                refreshToken: refreshTokenVal,
                expiresInMins: 30
            }
        });
    }
}