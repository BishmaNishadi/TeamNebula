import { test, expect } from '@playwright/test';
import { signUpNewUser, loginUser, uniqueEmail } from './helpers';

test.describe('Login', () => {
  test('TC010 - Login with valid credentials', async ({ page }) => {
    const { email, password, name } = await signUpNewUser(page);
    await page.goto('/logout').catch(() => {});
    await loginUser(page, email, password);
    await expect(page.getByText(new RegExp(`Logged in as ${name}`, 'i'))).toBeVisible({ timeout: 15_000 });
  });

  test('TC011 - Login with invalid password', async ({ page }) => {
    const { email } = await signUpNewUser(page);
    await page.goto('/logout').catch(() => {});
    await loginUser(page, email, 'wrong-password');
    await expect(page.getByText(/Your email or password is incorrect/i)).toBeVisible({ timeout: 15_000 });
  });

  test('TC012 - Login with unregistered email', async ({ page }) => {
    await loginUser(page, uniqueEmail('qa.unknown'), 'whatever');
    await expect(page.getByText(/Your email or password is incorrect/i)).toBeVisible({ timeout: 15_000 });
  });

  test('TC013 - Login with empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.login-form button[type="submit"]').click();
    await expect(page).toHaveURL(/login/);
  });

  test('TC014 - Logout', async ({ page }) => {
    await signUpNewUser(page);
    await page.getByRole('link', { name: /Logout/i }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/Logged in as/i)).toHaveCount(0);
  });
});
