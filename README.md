# Playwright POM Automation Framework

This repository covers the automation testing of Sauce Demo, a web-based e-commerce application designed for practicing and demonstrating UI automation.

The project is built using Playwright with JavaScript and follows the Page Object Model (POM) design pattern to improve test organization, maintainability, and reusability.

The test suite covers key user workflows including login, product validation, product sorting, shopping cart, and checkout. The project also includes data-driven testing, dynamic test scenarios, cross-browser testing, and CI/CD integration using GitHub Actions.

## Tech Stack

- Playwright
- JavaScript
- Node.js
- GitHub Actions

## Coverage

### UI Testing
- Login
- Product validation
- Product sorting
- Cart
- Checkout
- Checkout validation
- Order completion

## Project Structure

pages/
    LoginPage.js
    InventoryPage.js
    ProductDetailsPage.js
    CartPage.js
    CheckoutPage.js
    CheckoutCompletePage.js

test-data/
    testData.js

tests/
    login.spec.js
    inventory.spec.js
    cart.spec.js
    checkout.spec.js
│
github/
    workflows/
    playwright.yml

playwright.config.js
package.json
README.md

## Folder Description
- pages/ – Contains Page Object classes and locators for each application page.
- test-data/ – Contains reusable test data such as usernames, passwords, product details, and checkout information.
- tests/ – Contains the Playwright test scenarios.
- .github/workflows/ – Contains the GitHub Actions workflow used to run automated tests in CI.
- playwright.config.js – Contains Playwright configuration such as browsers, base URL, retries, and reporting.

## Installation

Install the project dependencies: npm install
Install Playwright browsers: npx playwright install

## Run Tests

Run the complete test suite: npx playwright test

## Run Headed

Run tests with the browser visible: npx playwright test --headed

## View Report

After a test run, generate and view the Playwright HTML report: npx playwright show-report

## CI/CD

The project uses GitHub Actions to automatically install dependencies, install Playwright browsers, execute the test suite, and upload the Playwright test report.

This allows the automated tests to be executed as part of the CI workflow whenever changes are pushed to the repository.