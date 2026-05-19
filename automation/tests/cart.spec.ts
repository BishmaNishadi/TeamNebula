import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

async function addFirstFromListing(page: any) {
  await page.goto('/products');
  const card = page.locator('.features_items .product-image-wrapper').first();
  // Use the overlay add-to-cart that appears on hover; also works without hover via direct click
  await card.locator('.productinfo .add-to-cart').first().click();
  await expect(page.getByText(/Added!/i)).toBeVisible({ timeout: 10_000 });
}

test.describe('Cart', () => {
  test('TC026 - Empty cart message', async ({ page }) => {
    await page.goto('/view_cart');
    await expect(page.getByText(/Cart is empty/i)).toBeVisible({ timeout: 10_000 });
  });

  test('TC022 - Add product to cart from listing', async ({ page }) => {
    await addFirstFromListing(page);
    await page.getByRole('button', { name: /Continue Shopping/i }).click();
    await page.goto('/view_cart');
    const rows = page.locator('#cart_info_table tbody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('TC023 - View cart shows added product', async ({ page }) => {
    await addFirstFromListing(page);
    await page.getByRole('link', { name: /View Cart/i }).click();
    await expect(page.locator('#cart_info_table')).toBeVisible();
    await expect(page.locator('#cart_info_table tbody tr').first()).toBeVisible();
  });

  test('TC024 - Update quantity from product detail then view in cart', async ({ page }) => {
    await page.goto('/product_details/1');
    await page.locator('#quantity').fill('4');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('link', { name: /View Cart/i }).click();
    await expect(page.locator('.cart_quantity button').first()).toHaveText('4');
  });

  test('TC027 - Add same product twice merges quantity', async ({ page }) => {
    await page.goto('/product_details/1');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('button', { name: /Continue Shopping/i }).click();
    await page.goto('/product_details/1');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('link', { name: /View Cart/i }).click();
    const rows = page.locator('#cart_info_table tbody tr');
    expect(await rows.count()).toBe(1);
    await expect(page.locator('.cart_quantity button').first()).toHaveText('2');
  });

  test('TC025 - Remove product from cart', async ({ page }) => {
    await addFirstFromListing(page);
    await page.getByRole('button', { name: /Continue Shopping/i }).click();
    await page.goto('/view_cart');
    await page.locator('.cart_delete a.cart_quantity_delete').first().click();
    await page.waitForTimeout(1_500);
    const emptyVisible = await page.getByText(/Cart is empty/i).isVisible().catch(() => false);
    const rowsLeft = await page.locator('#cart_info_table tbody tr').count();
    expect(emptyVisible || rowsLeft === 0).toBeTruthy();
  });
});
