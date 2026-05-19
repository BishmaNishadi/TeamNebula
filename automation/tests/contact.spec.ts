import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

test.describe('Contact', () => {
  test('TC032 - Submit contact form successfully', async ({ page }) => {
    // Prepare a small temp file for upload
    const tmpFile = path.join(os.tmpdir(), `qa-upload-${Date.now()}.txt`);
    fs.writeFileSync(tmpFile, 'hello from qa');
    page.on('dialog', d => d.accept());

    await page.goto('/contact_us');
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill(`qa.contact.${Date.now()}@example.com`);
    await page.locator('input[name="subject"]').fill('Automated test');
    await page.locator('#message').fill('This is an automated test submission.');
    await page.locator('input[name="upload_file"]').setInputFiles(tmpFile);
    await page.locator('input[name="submit"]').click();
    await expect(page.locator('#contact-page').getByText(/Success! Your details have been submitted successfully/i)).toBeVisible({ timeout: 20_000 });
    fs.unlinkSync(tmpFile);
  });

  test('TC033 - Contact form requires fields', async ({ page }) => {
    await page.goto('/contact_us');
    await page.locator('input[name="submit"]').click();
    // Expectation per TC033: required fields should block submit.
    // ACTUAL: name/subject inputs lack the `required` attribute, so the browser
    // does not block submission. Tracked as BUG002 in defects.csv.
    const requiredOnName = await page.locator('input[name="name"]').evaluate((el: HTMLInputElement) => el.required);
    expect(requiredOnName, 'Name field should be marked required (currently is not)').toBeTruthy();
  });
});
