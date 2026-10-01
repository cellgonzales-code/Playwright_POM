import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { testData } from '../test-data/testData.js';

let Login, inventoryPage, productDetailsPage;

test.beforeEach(async ({ page }) => {
    Login = new LoginPage(page);
    await Login.gotoLoginPage();
    await Login.login(testData.users.standardUser.username, testData.users.standardUser.password);
    inventoryPage = new InventoryPage(page);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    productDetailsPage = new ProductDetailsPage(page);
});

test('Validate details for each product are displayed', async () => {
    for (const productData of Object.values(testData.products)) {
        await inventoryPage.openProduct(productData.name);
        await expect(productDetailsPage.productName).toHaveText(productData.name);
        await expect(productDetailsPage.productDescription).toHaveText(productData.description);
        await expect(productDetailsPage.productPrice).toHaveText(productData.price);
        await expect(productDetailsPage.productImage).toHaveAttribute('alt', productData.imageAlt);

        await inventoryPage.goBackToInventory();
    }
});

test('Validate randomly selected product via product Name', async () => {
    const selectedProductName = await inventoryPage.selectViaProductNameRandomly();
    const productData = Object.values(testData.products).find(product => product.name === selectedProductName);
    expect(productData).toBeDefined();
    await expect(productDetailsPage.productName).toHaveText(productData.name);
    await expect(productDetailsPage.productDescription).toHaveText(productData.description);
    await expect(productDetailsPage.productPrice).toHaveText(productData.price);
    await expect(productDetailsPage.productImage).toHaveAttribute('alt', productData.imageAlt);
});

test('Validate add to cart via product details page', async () => {
    const selectedProductName = await inventoryPage.selectViaProductNameRandomly();
    const productData = Object.values(testData.products).find(product => product.name === selectedProductName);
    expect(productData).toBeDefined();
    await productDetailsPage.addToCart();
    expect(productDetailsPage.removeFromCartButton).toHaveText('Remove');
});

test('Validate remove from cart via product details page', async () => {
    const selectedProductName = await inventoryPage.selectViaProductNameRandomly();
    const productData = Object.values(testData.products).find(product => product.name === selectedProductName);
    expect(productData).toBeDefined();
    await productDetailsPage.addToCart();
    expect(productDetailsPage.removeFromCartButton).toHaveText('Remove');
    await productDetailsPage.removeFromCart();
    expect(productDetailsPage.productAddToCartButton).toHaveText('Add to cart');
});

test('Validate product to have at least 6 products', async () => {
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(6);
});

test('Validate add backpack to cart', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    const cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('1');
    await expect(inventoryPage.backpackRemoveFromCartBtn).toHaveText('Remove');
})

test('Validate remove backpack from cart', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    const cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('1');
    await expect(inventoryPage.backpackRemoveFromCartBtn).toHaveText('Remove');
    await inventoryPage.backpackRemoveFromCartBtn.click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(inventoryPage.backpackAddToCartBtn).toHaveText('Add to cart');
})

test('Validate default sorting as A -> Z', async () => {
    await expect(inventoryPage.sortDropdown).toHaveValue('az')
});

test('Sort product by Z -> A', async () => {
    await expect(inventoryPage.sortDropdown).toHaveValue('az')
    await inventoryPage.sortProductsByZtoA();
    await expect(inventoryPage.sortDropdown).toHaveValue('za')
    const productNames = await inventoryPage.getProductNames();
    const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a))
    expect(productNames).toEqual(sortedNames);
})

test('Sort product by Price Low -> High', async () => {
    await expect(inventoryPage.sortDropdown).toHaveValue('az')
    await inventoryPage.sortProductsByPriceLowToHigh();
    await expect(inventoryPage.sortDropdown).toHaveValue('lohi')
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
})

test('Sort product by Price High -> Low', async () => {
    await expect(inventoryPage.sortDropdown).toHaveValue('az')
    await inventoryPage.sortProductsByPriceHighToLow();
    await expect(inventoryPage.sortDropdown).toHaveValue('hilo')
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
})
