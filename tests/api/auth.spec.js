import { test, expect } from '@playwright/test';
import { AuthApi } from '../../api/AuthApi.js';
import { testData } from '../../test-data/testData.js';

test('Validate login with valid credentials', async ({ request }) => {
    const api = new AuthApi(request);

    const loginResponse = await api.login(testData.apiUserCredentials.username, testData.apiUserCredentials.password);
    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    expect(loginBody).toHaveProperty('accessToken');
    expect(loginBody).toHaveProperty('refreshToken');
    expect(loginBody.id).toBe(testData.apiUserCredentials.id);
    expect(loginBody.username).toBe(testData.apiUserCredentials.username);
    expect(loginBody.email).toBe(testData.apiUserCredentials.email);
    expect(loginBody.firstName).toBe(testData.apiUserCredentials.firstName);
    expect(loginBody.lastName).toBe(testData.apiUserCredentials.lastName);
    expect(loginBody.gender).toBe(testData.apiUserCredentials.gender);
    expect(loginBody.image).toBe(testData.apiUserCredentials.image);
});

test('Validate login with invalid credentials', async ({ request }) => {
    const api = new AuthApi(request);

    const loginResponse = await api.login('invalidUser', 'invalidPass');
    expect(loginResponse.status()).toBe(400);
    const loginBody = await loginResponse.json();
    expect(loginBody).toHaveProperty('message');
    expect(loginBody.message).toBe('Invalid credentials');
});

test('Validate login with missing credentials', async ({ request }) => {
    const api = new AuthApi(request);

    const loginResponse = await api.login('', '');
    expect(loginResponse.status()).toBe(400);
    const loginBody = await loginResponse.json();
    expect(loginBody).toHaveProperty('message');
    expect(loginBody.message).toBe('Username and password required');
});

test('Validate login with missing username', async ({ request }) => {
    const api = new AuthApi(request);

    const loginResponse = await api.login('', testData.apiUserCredentials.password);
    expect(loginResponse.status()).toBe(400);
    const loginBody = await loginResponse.json();
    expect(loginBody).toHaveProperty('message');
    expect(loginBody.message).toBe('Username and password required');
});

test('Validate login with missing password', async({request}) =>{
    const api = new AuthApi(request);
    
    const loginResponse = await api.login(testData.apiUserCredentials.password , '')
    expect(loginResponse.status()).toBe(400);
    const loginBody = await loginResponse.json();
    expect(loginBody).toHaveProperty('message');
    expect(loginBody.message).toBe('Username and password required');
})

test('Validate retrieve current user using valid token', async ({request}) => {
    const api = new AuthApi(request);

    const loginResponse = await api.login(testData.apiUserCredentials.username, testData.apiUserCredentials.password);
    const loginBody = await loginResponse.json();
    const accessTokenVal = loginBody.accessToken;
    const currentUserResponse = await api.getCurrentUser(accessTokenVal);
    expect(currentUserResponse.status()).toBe(200);
})

test('Valdate current user using invalid token', async ({request}) =>{
    const api = new AuthApi(request);

    const currentUserResponse = await api.getCurrentUser('invalid_token');
    expect(currentUserResponse.status()).toBe(401)
    const currentUserReponseBody = await currentUserResponse.json();
    expect(currentUserReponseBody).toHaveProperty('message');
    expect(currentUserReponseBody.message).toBe('Invalid/Expired Token!')

})

test('Validate refresh token successfully', async ({request}) =>{
    const api = new AuthApi(request);

    const loginResponse = await api.login(testData.apiUserCredentials.username, testData.apiUserCredentials.password);
    const loginBody = await loginResponse.json();
    const refreshTokenVal = loginBody.refreshToken;

    const refreshResponse = await api.refreshToken(refreshTokenVal);
    expect(refreshResponse.status()).toBe(200);
    const refreshBody = await refreshResponse.json();
    expect(refreshBody).toHaveProperty('accessToken');
})

test('Validate refresh using invalid token', async ({request}) =>{
    const api = new AuthApi(request);

    const refreshResponse = await api.refreshToken('invalid_token');
    expect(refreshResponse.status()).toBe(403);
    const refreshBody = await refreshResponse.json();
    expect(refreshBody).toHaveProperty('message');
    expect(refreshBody.message).toBe('Invalid refresh token')
})



