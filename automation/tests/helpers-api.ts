import { APIRequestContext, expect } from '@playwright/test';

/**
 * Shared helpers for API specs.
 * Keep this minimal — add only what tests actually need.
 */

export interface ApiCallOptions {
  expectedStatus?: number;
  maxResponseTimeMs?: number;
}

/**
 * Wraps an API call to assert status + response time, and parse JSON safely.
 */
export async function apiCall<T = unknown>(
  fn: () => Promise<import('@playwright/test').APIResponse>,
  opts: ApiCallOptions = {},
): Promise<{ status: number; body: T | string; headers: Record<string, string>; ms: number }> {
  const start = Date.now();
  const res = await fn();
  const ms = Date.now() - start;
  const status = res.status();
  const headers = res.headers();
  const text = await res.text();
  let body: T | string = text;
  const ct = headers['content-type'] || '';
  if (ct.includes('application/json') && text.length) {
    try { body = JSON.parse(text) as T; } catch { /* keep text */ }
  }
  if (opts.expectedStatus !== undefined) {
    expect(status, `Expected status ${opts.expectedStatus} but got ${status}. Body: ${text.slice(0, 500)}`).toBe(opts.expectedStatus);
  }
  if (opts.maxResponseTimeMs !== undefined) {
    expect(ms, `Response took ${ms}ms (max ${opts.maxResponseTimeMs}ms)`).toBeLessThanOrEqual(opts.maxResponseTimeMs);
  }
  return { status, body, headers, ms };
}

/**
 * Assert an object has all required keys with non-undefined values.
 * Lightweight contract check — swap for ajv if real JSON Schema is needed.
 */
export function expectShape(obj: unknown, requiredKeys: string[]): void {
  expect(obj && typeof obj === 'object', `Expected object, got ${typeof obj}`).toBeTruthy();
  const o = obj as Record<string, unknown>;
  for (const k of requiredKeys) {
    expect(o[k], `Missing required key: ${k}`).not.toBeUndefined();
  }
}

/**
 * Cache an auth token across tests in the same worker.
 * Populate via env var (API_TOKEN) or call loginAndCacheToken() in a beforeAll.
 */
let cachedToken: string | undefined = process.env.API_TOKEN;
export function getToken(): string | undefined { return cachedToken; }
export function setToken(t: string | undefined): void { cachedToken = t; }

export function authHeaders(): Record<string, string> {
  return cachedToken ? { Authorization: `Bearer ${cachedToken}` } : {};
}

/**
 * Example login helper — adapt endpoint/payload to the real API.
 */
export async function loginAndCacheToken(
  request: APIRequestContext,
  path: string,
  payload: Record<string, unknown>,
  tokenPath: string[] = ['token'],
): Promise<string> {
  const res = await request.post(path, { data: payload });
  expect(res.ok(), `Login failed: ${res.status()}`).toBeTruthy();
  const json = await res.json();
  let token: unknown = json;
  for (const k of tokenPath) token = (token as Record<string, unknown>)?.[k];
  expect(typeof token, 'Token not found in login response').toBe('string');
  setToken(token as string);
  return token as string;
}
