export class CheckoutCompletePage {
    constructor(page) {
        this.page = page;
        this.checkoutCompleteHeader = page.locator('[data-test="title"]');
        this.checkoutCheckIcon = page.locator('[data-test="pony-express"]');
        this.checkoutThankYouMessage = page.locator('[data-test="complete-header"]');
        this.checkoutMessage = page.locator('[data-test="complete-text"]');
        this.checkoutBackHomeButton = page.locator('[data-test="back-to-products"]');
    }
}