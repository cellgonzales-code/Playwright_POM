export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username_txtbox = page.getByLabel('Username');
    this.password_txtbox = page.getByLabel('Password');
    this.login_btn = page.getByRole('button', { name: 'Login' });
  }

  async gotoLoginPage() {
    await this.page.goto('https://the-internet.herokuapp.com/login');
  }

  async login(username, password) {
    await this.username_txtbox.fill(username);
    await this.password_txtbox.fill(password);
    await this.login_btn.click();
  }
}