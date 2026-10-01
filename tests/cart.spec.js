import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { testData } from '../test-data/testData.js';
import { CartPage } from '../pages/CartPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';

let loginPage, cartPage, inventoryPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.login(
        testData.users.standardUser.username,
        testData.users.standardUser.password
    );
    await page.waitForURL('**/inventory.html');
});

test('Validate cart link is present', async () => {
    await expect(cartPage.cartLink).toBeVisible();
});

test('Validate initial cart is empty', async () => {
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toHaveCount(0);
});

test('Validate added product is present in the cart', async () => {
    await inventoryPage.addToCartBackpack();
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe('1');
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toHaveCount(1);
    await expect(cartPage.inventoryItemName).toHaveText(testData.products.backpack.name);
});

test('Validate randomly selected products are present in the cart', async () => {
    const selectedProducts = await inventoryPage.addRandomProductsToCart(3);
    const expectedProductCount = selectedProducts.length;
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe(String(expectedProductCount));
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toHaveCount(expectedProductCount);
    await expect(cartPage.inventoryItemName).toHaveText(selectedProducts);
});

test('Validate removal of added product is no longer present in the cart', async () => {
    await inventoryPage.addToCartBackpack();
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe('1');
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toBeVisible();
    await cartPage.removeBackpackFromCart();
    await expect(cartPage.inventoryItem).toHaveCount(0);
});

test('Validate randomly selected & removal of products are no longer present in the cart', async () => {
    // Add random products to the cart
    const selectedProducts = await inventoryPage.addRandomProductsToCart(3);
    const expectedProductCount = selectedProducts.length;
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe(String(expectedProductCount));
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toHaveCount(expectedProductCount);
    await expect(cartPage.inventoryItemName).toHaveText(selectedProducts);

    // Remove random products from the cart
    const removedProductNames = await cartPage.removeRandomProducts(2);
    const remainingProducts = selectedProducts.filter(product => !removedProductNames.includes(product));
    const remainingProductCount = remainingProducts.length;
    const updatedCartCount = await cartPage.cartLink.textContent();
    expect(updatedCartCount).toBe(String(remainingProductCount));
    await expect(cartPage.inventoryItem).toHaveCount(remainingProductCount);
    await expect(cartPage.inventoryItemName).toHaveText(remainingProducts);

    console.log('Removed Products:', removedProductNames);
    console.log('Remaining Products:', remainingProducts);
});

test('Validate Continue Shopping button navigates back to inventory page', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe('1');
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toBeVisible();
    await cartPage.clickContinueShopping();
    await expect(page).toHaveURL('/inventory.html');
});

test('Validate Checkout button navigates to checkout page', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe('1');
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toHaveCount(1);
    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
});