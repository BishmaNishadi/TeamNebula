import { test, expect } from '@playwright/test';

test.describe('Informational Pages', () => {
  test('TC034 - Test Cases page renders list', async ({ page }) => {
    await page.goto('/test_cases');
    await expect(page.getByRole('heading', { name: /Test Cases/i }).first()).toBeVisible();
    expect(await page.locator('.panel-group, .panel').count()).toBeGreaterThan(0);
  });

  test('TC035 - API List page renders', async ({ page }) => {
    await page.goto('/api_list');
    await expect(page.getByText(/APIs List for practice/i)).toBeVisible();
  });
});
