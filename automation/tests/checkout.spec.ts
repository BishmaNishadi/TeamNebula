import { test, expect } from '@playwright/test';
import { signUpNewUser } from './helpers';

test.describe('Checkout', () => {
  test('TC028 - Proceed to checkout requires login', async ({ page }) => {
    await page.goto('/product_details/1');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('link', { name: /View Cart/i }).click();
    await page.getByText(/Proceed To Checkout/i).click();
    await expect(page.getByRole('link', { name: /Register \/ Login/i })).toBeVisible({ timeout: 10_000 });
  });

  test('TC029 - Checkout shows address and review', async ({ page }) => {
    await signUpNewUser(page);
    await page.goto('/product_details/1');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('link', { name: /View Cart/i }).click();
    await page.getByText(/Proceed To Checkout/i).click();
    await expect(page.getByRole('heading', { name: /Address Details/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Review Your Order/i })).toBeVisible();
  });

  test('TC030 - Place order with valid card', async ({ page }) => {
    await signUpNewUser(page);
    await page.goto('/product_details/1');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('link', { name: /View Cart/i }).click();
    await page.getByText(/Proceed To Checkout/i).click();
    await page.locator('textarea[name="message"]').fill('Please deliver between 9-5.');
    await page.getByRole('link', { name: /Place Order/i }).click();
    await page.locator('input[name="name_on_card"]').fill('Test User');
    await page.locator('input[name="card_number"]').fill('4111111111111111');
    await page.locator('input[name="cvc"]').fill('123');
    await page.locator('input[name="expiry_month"]').fill('12');
    await page.locator('input[name="expiry_year"]').fill('2030');
    await page.getByRole('button', { name: /Pay and Confirm Order/i }).click();
    await expect(page.getByText(/Order Placed!/i).first()).toBeVisible({ timeout: 20_000 });
  });

  test('TC031 - Place order with empty card details', async ({ page }) => {
    await signUpNewUser(page);
    await page.goto('/product_details/1');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.getByRole('link', { name: /View Cart/i }).click();
    await page.getByText(/Proceed To Checkout/i).click();
    await page.getByRole('link', { name: /Place Order/i }).click();
    await page.getByRole('button', { name: /Pay and Confirm Order/i }).click();
    // Should still be on payment page (native required validation)
    await expect(page).toHaveURL(/payment/);
  });
});
