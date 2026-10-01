export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.inventoryItem = page.locator('[data-test="inventory-item"]');
        this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
        this.removeBackpackBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.removeProductBtn = '[data-test^="remove-sauce-labs-"]';
        this.continueShopping = page.locator('[data-test="continue-shopping"]');
        this.checkoutBtn = page.locator('[data-test="checkout"]');
    }

    async openCart() {
        await this.cartLink.click();
    }

    async removeBackpackFromCart() {
        await this.removeBackpackBtn.click();
    }

    async removeRandomProducts(numberOfProducts) {
        const products = await this.inventoryItem.all();

        if (numberOfProducts > products.length) {
            throw new Error(`Requested number of products (${numberOfProducts}) exceeds available products (${products.length}).`);
        };

        const shuffledProducts = [...products];

        for (let i = shuffledProducts.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));

            [shuffledProducts[i], shuffledProducts[randomIndex]] =
                [shuffledProducts[randomIndex], shuffledProducts[i]];
        }

        const selectedProductsToBeRemoved =
            shuffledProducts.slice(0, numberOfProducts);

        const selectedProductNamesTobeRemoved = [];

        for (const product of selectedProductsToBeRemoved) {
            const productName =
                await product.locator(this.inventoryItemName).textContent();

            selectedProductNamesTobeRemoved.push(productName.trim());

            await product.locator(this.removeProductBtn).click();
        }

        return selectedProductNamesTobeRemoved;
    }

    async clickContinueShopping() {
        await this.continueShopping.click();
    }

    async clickCheckout() {
        await this.checkoutBtn.click();
    }
}