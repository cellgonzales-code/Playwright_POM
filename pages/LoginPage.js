export class LoginPage {
  constructor(page) {
    this.page = page;

    //Login
    this.username_txtbox = page.locator('[data-test="username"]');
    this.password_txtbox = page.locator('[data-test="password"]');
    this.login_btn = page.locator('[data-test="login-button"]');
    this.login_error = page.locator('[data-test="error"]');

    //Logout
    this.menu_btn = page.getByRole('button', { name: 'Open Menu' });
    this.logout_link = page.locator('[data-test="logout-sidebar-link"]');

  }

  async gotoLoginPage() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.username_txtbox.fill(username);
    await this.password_txtbox.fill(password);
    await this.login_btn.click();
  }


  async logout() {
    await this.menu_btn.click();
    await this.logout_link.click();
  }

}