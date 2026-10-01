export class ProductDetailsPage {
    constructor(page) {
        this.page = page;
        this.productImage = page.locator('.inventory_details_img');
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.productDescription = page.locator('[data-test="inventory-item-desc"]');
        this.productPrice = page.locator('[data-test="inventory-item-price"]');
        this.productAddToCartButton = page.locator('[data-test^="add-to-cart"]');
        this.removeFromCartButton = page.locator('[data-test^="remove"]');
    }

    async addToCart() {
        await this.productAddToCartButton.click();
    }

    async removeFromCart() {
        await this.removeFromCartButton.click();
    }
}