import { test, expect } from '@playwright/test';
import { apiCall, expectShape } from '../helpers-api';

/**
 * Template API spec. Copy this file per resource (e.g. users.api.spec.ts, products.api.spec.ts)
 * once real endpoints are known. baseURL comes from API_BASE_URL or BASE_URL env var.
 *
 * Run only API tests:   npx playwright test --project=api
 * Run only UI tests:    npx playwright test --project=chromium
 */

test.describe('API - Example resource (template)', () => {
  test.skip(true, 'Template only — replace with real endpoints, then remove this skip.');

  test('GET /resource returns 200 with expected shape', async ({ request }) => {
    const { body, ms } = await apiCall(
      () => request.get('/api/resource'),
      { expectedStatus: 200, maxResponseTimeMs: 2000 },
    );
    expect(Array.isArray(body) || typeof body === 'object').toBeTruthy();
    expectShape(Array.isArray(body) ? body[0] : body, ['id']);
    console.log(`Response time: ${ms}ms`);
  });

  test('POST /resource with valid payload returns 201', async ({ request }) => {
    await apiCall(
      () => request.post('/api/resource', { data: { name: 'sample' } }),
      { expectedStatus: 201 },
    );
  });

  test('POST /resource with missing required field returns 400', async ({ request }) => {
    await apiCall(
      () => request.post('/api/resource', { data: {} }),
      { expectedStatus: 400 },
    );
  });

  test('GET /resource without auth returns 401', async ({ request }) => {
    await apiCall(
      () => request.get('/api/resource', { headers: { Authorization: '' } }),
      { expectedStatus: 401 },
    );
  });

  test('GET /resource/{id} with non-existent id returns 404', async ({ request }) => {
    await apiCall(
      () => request.get('/api/resource/000000'),
      { expectedStatus: 404 },
    );
  });
});
