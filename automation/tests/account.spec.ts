import { test, expect } from '@playwright/test';
import { signUpNewUser } from './helpers';

test.describe('Account', () => {
  test('TC015 - Delete account', async ({ page }) => {
    await signUpNewUser(page);
    await page.getByRole('link', { name: /Delete Account/i }).click();
    await expect(page.getByText(/Account Deleted!/i)).toBeVisible({ timeout: 15_000 });
    await page.getByRole('link', { name: /Continue/i }).click();
    await expect(page.getByText(/Logged in as/i)).toHaveCount(0);
  });
});
