export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.errorMessage = page.locator('[data-test="error"]');

        this.checkoutOverview = page.locator('[data-test="title"]');
        this.inventoryItem = page.locator('[data-test="inventory-item"]');
        this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
        this.inventoryItemDescription = page.locator('[data-test="inventory-item-desc"]');
        this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');
        this.paymentInformation = page.locator('[data-test="payment-info-label"]');
        this.paymentInformationValue = page.locator('[data-test="payment-info-value"]');
        this.shippingInformation = page.locator('[data-test="shipping-info-label"]');
        this.shippingInformationValue = page.locator('[data-test="shipping-info-value"]');
        this.itemTotalValue = page.locator('[data-test="subtotal-label"]');
        this.taxValue = page.locator('[data-test="tax-label"]');
        this.priceTotalValue = page.locator('[data-test="total-label"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    getProductItem(productName) {
    return this.inventoryItem.filter({
        has: this.inventoryItemName.filter({ hasText: productName })
    });
}
}