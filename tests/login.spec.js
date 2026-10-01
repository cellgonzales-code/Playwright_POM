import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { testData } from '../test-data/testData.js';



let Login;

test.beforeEach(async ({ page }) => {
  Login = new LoginPage(page);
  await Login.gotoLoginPage();
});

test('Valid Login', async ({ page }) => {
  await Login.login(testData.users.standardUser.username, testData.users.standardUser.password);
  await expect(page).toHaveURL('/inventory.html');
  await expect(page.locator('.title')).toContainText('Products');
});

test('Invalid Username', async () => {
  await Login.login('test', testData.users.standardUser.password);
  await expect(Login.login_error).toContainText('Epic sadface: Username and password do not match any user in this service');
});

test('Invalid Password', async () => {
  await Login.login(testData.users.standardUser.username, 'test');
  await expect(Login.login_error).toContainText('Epic sadface: Username and password do not match any user in this service');
});

test('Invalid Username & Password', async () => {
  await Login.login('test', 'test');
  await expect(Login.login_error).toContainText('Epic sadface: Username and password do not match any user in this service');
});

test('Empty Username', async () => {
  await Login.login('', testData.users.standardUser.password);
  await expect(Login.login_error).toContainText('Epic sadface: Username is required');
});

test('Empty Password', async () => {
  await Login.login(testData.users.standardUser.username, '');
  await expect(Login.login_error).toContainText('Epic sadface: Password is required');
});

test('User is locked out', async () => {
  await Login.login(testData.users.lockedOutUser.username, testData.users.lockedOutUser.password);
  await expect(Login.login_error).toContainText('Epic sadface: Sorry, this user has been locked out.');
});

test('Logout', async ({ page }) => {
  await Login.login(testData.users.standardUser.username, testData.users.standardUser.password);
  await expect(page).toHaveURL('/inventory.html');
  await Login.logout();
  await expect(page).toHaveURL('/');
});