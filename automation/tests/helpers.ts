import { test, expect, Page } from '@playwright/test';

export function uniqueEmail(prefix = 'qa.user') {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
}

/**
 * Full signup: fills the New User Signup section, then the account-details form,
 * clicks Create Account and Continue. Returns the credentials used.
 */
export async function signUpNewUser(
  page: Page,
  name = 'Test User',
  email: string = uniqueEmail(),
  password = 'Password1!'
) {
  await page.goto('/login');
  await page.locator('.signup-form input[name="name"]').fill(name);
  await page.locator('.signup-form input[name="email"]').fill(email);
  await page.locator('.signup-form button[type="submit"]').click();
  await expect(page.getByText(/Enter Account Information/i)).toBeVisible({ timeout: 15_000 });
  await page.locator('#id_gender1').check();
  await page.locator('#password').fill(password);
  await page.locator('#days').selectOption('1');
  await page.locator('#months').selectOption('1');
  await page.locator('#years').selectOption('1990');
  await page.locator('#first_name').fill('Test');
  await page.locator('#last_name').fill('User');
  await page.locator('#address1').fill('123 Main St');
  await page.locator('#country').selectOption('United States');
  await page.locator('#state').fill('CA');
  await page.locator('#city').fill('San Francisco');
  await page.locator('#zipcode').fill('94016');
  await page.locator('#mobile_number').fill('5551234567');
  await page.getByRole('button', { name: /Create Account/i }).click();
  await expect(page.getByText(/Account Created!/i)).toBeVisible({ timeout: 15_000 });
  await page.getByRole('link', { name: /Continue/i }).click();
  await expect(page.getByText(/Logged in as/i)).toBeVisible({ timeout: 15_000 });
  return { name, email, password };
}

export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('.login-form input[name="email"]').fill(email);
  await page.locator('.login-form input[name="password"]').fill(password);
  await page.locator('.login-form button[type="submit"]').click();
}

export async function addFirstProductToCart(page: Page) {
  await page.goto('/products');
  const firstCard = page.locator('.features_items .product-image-wrapper').first();
  await firstCard.hover();
  await firstCard.locator('.overlay-content .add-to-cart, .productinfo .add-to-cart').first().click();
  await expect(page.getByText(/Added!|Your product has been added/i)).toBeVisible({ timeout: 10_000 });
}
