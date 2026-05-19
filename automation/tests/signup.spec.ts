import { test, expect } from '@playwright/test';
import { uniqueEmail, signUpNewUser } from './helpers';

test.describe('Signup', () => {
  test('TC006 - Register account with valid data', async ({ page }) => {
    await signUpNewUser(page);
  });

  test('TC007 - Signup with existing email', async ({ page }) => {
    const { email } = await signUpNewUser(page);
    await page.goto('/logout').catch(() => {});
    await page.goto('/login');
    await page.locator('.signup-form input[name="name"]').fill('Another');
    await page.locator('.signup-form input[name="email"]').fill(email);
    await page.locator('.signup-form button[type="submit"]').click();
    await expect(page.getByText(/Email Address already exist/i)).toBeVisible({ timeout: 15_000 });
  });

  test('TC008 - Signup with empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.signup-form button[type="submit"]').click();
    // Browser blocks submission; URL stays on /login
    await expect(page).toHaveURL(/login/);
  });

  test('TC009 - Signup with invalid email format', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.signup-form input[name="name"]').fill('Tester');
    await page.locator('.signup-form input[name="email"]').fill('invalidemail');
    await page.locator('.signup-form button[type="submit"]').click();
    await expect(page).toHaveURL(/login/);
    const validity = await page.locator('.signup-form input[name="email"]').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBeFalsy();
  });

  test('TC040 - Signup with very long name (boundary)', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.signup-form input[name="name"]').fill('a'.repeat(300));
    await page.locator('.signup-form input[name="email"]').fill(uniqueEmail('qa.long'));
    await page.locator('.signup-form button[type="submit"]').click();
    // Should reach account details form OR gracefully reject; should NOT crash
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
