import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { testData } from '../test-data/testData.js';
import { CartPage } from '../pages/CartPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';

let loginPage, cartPage, inventoryPage, checkoutPage, checkoutCompletePage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
    await loginPage.gotoLoginPage();
    await loginPage.login(
        testData.users.standardUser.username,
        testData.users.standardUser.password
    );
    await page.waitForURL('/inventory.html');
});

test('Validate checkout with valid information', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    await cartPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillCheckoutInformation(
        testData.userInformation.firstUser.firstName,
        testData.userInformation.firstUser.lastName,
        testData.userInformation.firstUser.postalCode
    );
    await expect(checkoutPage.checkoutOverview).toHaveText('Checkout: Overview');
    await expect(checkoutPage.inventoryItem).toHaveCount(1);
    const productData = testData.products.backpack;
    await expect(checkoutPage.inventoryItemName).toHaveText(productData.name);
    await expect(checkoutPage.inventoryItemDescription).toHaveText(productData.description);
    await expect(checkoutPage.inventoryItemPrice).toHaveText(productData.price);

    await expect(checkoutPage.paymentInformation).toBeVisible();
    await expect(checkoutPage.paymentInformationValue).toHaveText('SauceCard #31337');

    await expect(checkoutPage.shippingInformation).toBeVisible();
    await expect(checkoutPage.shippingInformationValue).toHaveText('Free Pony Express Delivery!');

    await expect(checkoutPage.itemTotalValue).toHaveText('Item total: $' + productData.price.replace('$', ''));
    await expect(checkoutPage.taxValue).toHaveText('Tax: $' + (parseFloat(productData.price.replace('$', '')) * 0.08).toFixed(2));
    await expect(checkoutPage.priceTotalValue).toHaveText('Total: $' + (parseFloat(productData.price.replace('$', '')) * 1.08).toFixed(2));
    await expect(checkoutPage.finishButton).toBeVisible();
})

test('Validate checkout with multiple randomly selected products', async ({ page }) => {
    await expect(inventoryPage.products.first()).toBeVisible();
    const selectedProducts = await inventoryPage.addRandomProductsToCart(3);
    const expectedProductCount = selectedProducts.length;
    const cartCount = await cartPage.cartLink.textContent();
    expect(cartCount).toBe(String(expectedProductCount));
    await cartPage.openCart();
    await expect(cartPage.inventoryItem).toHaveCount(expectedProductCount);
    await expect(cartPage.inventoryItemName).toHaveText(selectedProducts);

    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillCheckoutInformation(
        testData.userInformation.firstUser.firstName,
        testData.userInformation.firstUser.lastName,
        testData.userInformation.firstUser.postalCode
    );
    await expect(checkoutPage.checkoutOverview).toHaveText('Checkout: Overview');
    await expect(checkoutPage.inventoryItem).toHaveCount(expectedProductCount);

    const productData = Object.values(testData.products).filter(product => selectedProducts.includes(product.name));
    expect(productData.length).toBe(expectedProductCount);

    for (const product of productData) {
        const productItem = checkoutPage.getProductItem(product.name);
        await expect(productItem.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
        await expect(productItem.locator('[data-test="inventory-item-desc"]')).toHaveText(product.description);
        await expect(productItem.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);
    }

    await expect(checkoutPage.paymentInformation).toBeVisible();
    await expect(checkoutPage.paymentInformationValue).toHaveText('SauceCard #31337');

    await expect(checkoutPage.shippingInformation).toBeVisible();
    await expect(checkoutPage.shippingInformationValue).toHaveText('Free Pony Express Delivery!');

    let itemTotal = 0;
    for (const product of productData) {
        itemTotal = itemTotal + parseFloat(product.price.replace('$', ''));
    }

    const tax = itemTotal * 0.08;
    const total = itemTotal + tax;

    await expect(checkoutPage.itemTotalValue).toHaveText(
        'Item total: $' + itemTotal.toFixed(2)
    );

    await expect(checkoutPage.taxValue).toHaveText(
        'Tax: $' + tax.toFixed(2)
    );

    await expect(checkoutPage.priceTotalValue).toHaveText(
        'Total: $' + total.toFixed(2)
    );

    await expect(checkoutPage.finishButton).toBeVisible();
});

test('Validate checkout w/out First Name', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    await cartPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillCheckoutInformation(
        "",
        testData.userInformation.firstUser.lastName,
        testData.userInformation.firstUser.postalCode
    );
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
});

test('Validate checkout w/out Last Name', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    await cartPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillCheckoutInformation(
        testData.userInformation.firstUser.firstName,
        "",
        testData.userInformation.firstUser.postalCode
    );
    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
});

test('Validate checkout w/out Postal Code', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    await cartPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillCheckoutInformation(
        testData.userInformation.firstUser.firstName,
        testData.userInformation.firstUser.lastName,
        ""
    );
    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
});

test('Validate checkout complete page', async ({ page }) => {
    await inventoryPage.addToCartBackpack();
    await cartPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillCheckoutInformation(
        testData.userInformation.firstUser.firstName,
        testData.userInformation.firstUser.lastName,
        testData.userInformation.firstUser.postalCode
    );
    await checkoutPage.finishButton.click();
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutCompletePage.checkoutCompleteHeader).toHaveText('Checkout: Complete!');
    await expect(checkoutCompletePage.checkoutCheckIcon).toBeVisible();
    await expect(checkoutCompletePage.checkoutThankYouMessage).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.checkoutMessage).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    await expect(checkoutCompletePage.checkoutBackHomeButton).toBeVisible();
});