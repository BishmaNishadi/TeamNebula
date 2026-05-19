import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('TC038 - XSS in product search is sanitized', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async d => { dialogFired = true; await d.dismiss(); });
    await page.goto('/products');
    await page.locator('#search_product').fill('<img src=x onerror=alert(1)>');
    await page.locator('#submit_search').click();
    await page.waitForLoadState('domcontentloaded');
    expect(dialogFired, 'XSS payload should not execute').toBeFalsy();
    expect(await page.locator('img[onerror]').count()).toBe(0);
  });

  test('TC039 - SQL injection attempt in login is rejected', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.login-form input[name="email"]').fill("a@b.com");
    // Email type field forces a roughly-valid email; put SQLi in password instead which is freeform
    await page.locator('.login-form input[name="password"]').fill("' OR 1=1 --");
    await page.locator('.login-form button[type="submit"]').click();
    await expect(page.getByText(/Your email or password is incorrect/i)).toBeVisible({ timeout: 15_000 });
    const body = (await page.locator('body').innerText()).toLowerCase();
    expect(body).not.toMatch(/sql syntax|mysql_|sqlstate|psycopg|django.db/);
  });
});
