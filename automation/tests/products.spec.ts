import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('TC016 - All Products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: /All Products/i })).toBeVisible();
    const cards = page.locator('.features_items .product-image-wrapper');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('TC017 - View product details', async ({ page }) => {
    await page.goto('/products');
    await page.locator('.features_items a:has-text("View Product")').first().click();
    await expect(page).toHaveURL(/product_details/);
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('#quantity')).toBeVisible();
    await expect(page.getByRole('button', { name: /Add to cart/i })).toBeVisible();
  });

  test('TC018 - Search product returns results', async ({ page }) => {
    await page.goto('/products');
    await page.locator('#search_product').fill('top');
    await page.locator('#submit_search').click();
    await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible({ timeout: 10_000 });
    const cards = page.locator('.features_items .product-image-wrapper');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('TC019 - Search with no matches', async ({ page }) => {
    await page.goto('/products');
    await page.locator('#search_product').fill('zzzzznosuchitem');
    await page.locator('#submit_search').click();
    await page.waitForLoadState('domcontentloaded');
    const cards = page.locator('.features_items .product-image-wrapper');
    expect(await cards.count()).toBe(0);
  });

  test('TC020 - Search with empty query', async ({ page }) => {
    await page.goto('/products');
    await page.locator('#search_product').fill('');
    await page.locator('#submit_search').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC021 - Search special characters sanitized', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async d => { dialogFired = true; await d.dismiss(); });
    await page.goto('/products');
    await page.locator('#search_product').fill('<script>alert(1)</script>');
    await page.locator('#submit_search').click();
    await page.waitForLoadState('domcontentloaded');
    expect(dialogFired).toBeFalsy();
    expect(await page.locator('script:has-text("alert(1)")').count()).toBe(0);
  });
});
