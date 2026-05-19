import { test, expect } from '@playwright/test';

test.describe('UI', () => {
  test('TC036 - Responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 5);
    expect(hasHorizontalScroll, 'Should not have horizontal scroll on mobile').toBeFalsy();
  });

  test('TC037 - No broken images on home', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src)
    );
    expect(broken, `Broken images: ${broken.join(', ')}`).toEqual([]);
  });
});
