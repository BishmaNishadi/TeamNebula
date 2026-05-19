import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC001 - Home page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('#slider')).toBeVisible();
    await expect(page.locator('.features_items')).toBeVisible();
  });

  test('TC002 - Top navigation links visible', async ({ page }) => {
    const expectedHrefs = ['/', '/products', '/view_cart', '/login', '/test_cases', '/api_list', '/contact_us'];
    for (const href of expectedHrefs) {
      await expect(page.locator(`.shop-menu a[href="${href}"]`)).toBeVisible();
    }
  });

  test('TC003 - Subscription email submission', async ({ page }) => {
    await page.locator('#susbscribe_email').scrollIntoViewIfNeeded();
    await page.locator('#susbscribe_email').fill(`sub.${Date.now()}@example.com`);
    await page.locator('#subscribe').click();
    await expect(page.locator('.alert-success').first()).toBeVisible({ timeout: 10_000 });
  });

  test('TC004 - Subscription with invalid email', async ({ page }) => {
    await page.locator('#susbscribe_email').fill('notanemail');
    await page.locator('#subscribe').click();
    // Native validation: form should not submit
    const validity = await page.locator('#susbscribe_email').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBeFalsy();
  });

  test('TC005 - Scroll to top arrow returns to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.locator('#scrollUp').click();
    await page.waitForTimeout(1_000);
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeLessThan(100);
  });
});
