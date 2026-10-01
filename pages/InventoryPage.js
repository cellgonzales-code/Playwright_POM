export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator('[data-test="inventory-item"]');
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.addToCartButton = 'button[data-test^="add-to-cart"]';
        this.prices = page.locator('[data-test="inventory-item-price"]');
        this.backpackAddToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.backpackRemoveFromCartBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    async getProductCount() {
        return await this.products.count();
    }

    async addToCartBackpack() {
        await this.backpackAddToCartBtn.click();
    }

    async selectViaProductNameRandomly() {
        const products = await this.products.all();

        const shuffledProducts = [...products];
        for (let i = shuffledProducts.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledProducts[i], shuffledProducts[randomIndex]] = [shuffledProducts[randomIndex], shuffledProducts[i]];
        }

        const selectedProducts = shuffledProducts[0];
        // Get product name
        const productName = await selectedProducts.locator(this.productName).textContent();

        // Click the selected product
        await selectedProducts.locator(this.productName).click();

        return productName.trim();
    }

    async addRandomProductsToCart(numberOfProducts) {
        const products = await this.products.all();
        if (numberOfProducts > products.length) {
            throw new Error(`Requested number of products (${numberOfProducts}) exceeds available products (${products.length}).`);
        };

        const shuffledProducts = [...products];
        for (let i = shuffledProducts.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledProducts[i], shuffledProducts[randomIndex]] = [shuffledProducts[randomIndex], shuffledProducts[i]];
        }

        const selectedProducts = shuffledProducts.slice(0, numberOfProducts);
        const selectedProductNames = [];
        for (const product of selectedProducts) {
            const productName = await product.locator(this.productName).textContent();
            selectedProductNames.push(productName.trim());
            await product.locator(this.addToCartButton).click();
        }
        return selectedProductNames;
    }

    async openProduct(productName) {
        await this.productName.filter({ hasText: productName }).click();
    }

    async getProductNames() {
        return await this.productName.allTextContents();
    }

    async getProductPrices() {
        const prices = await this.prices.allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    async sortProductsByZtoA() {
        await this.sortDropdown.selectOption('za');
    }

    async sortProductsByPriceLowToHigh() {
        await this.sortDropdown.selectOption('lohi');
    }

    async sortProductsByPriceHighToLow() {
        await this.sortDropdown.selectOption('hilo');
    }

    async goBackToInventory() {
        await this.page.goBack();
    }
}