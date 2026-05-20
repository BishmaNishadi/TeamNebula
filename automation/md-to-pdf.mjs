// Convert strategy.md to strategy.pdf using marked + Playwright (Chromium already installed).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
void root;
const mdPath = resolve(root, 'strategy.md');
const pdfPath = resolve(root, 'strategy.pdf');

const md = readFileSync(mdPath, 'utf8');
const body = marked.parse(md);

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>QA Strategy</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#222; max-width: 860px; margin: 32px auto; padding: 0 24px; line-height: 1.55; font-size: 12pt; }
  h1 { border-bottom: 2px solid #333; padding-bottom: 6px; font-size: 22pt; }
  h2 { border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 28px; font-size: 16pt; }
  h3 { margin-top: 20px; font-size: 13pt; }
  code { background: #f4f4f4; padding: 1px 4px; border-radius: 3px; font-size: 90%; }
  pre { background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 10pt; }
  pre code { background: transparent; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 11pt; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; }
  blockquote { border-left: 4px solid #ddd; margin: 0; padding: 4px 14px; color: #555; }
  ul, ol { padding-left: 24px; }
  hr { border: none; border-top: 1px solid #ddd; margin: 22px 0; }
  a { color: #0366d6; }
</style></head><body>${body}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
  printBackground: true,
});
await browser.close();
console.log('Wrote', pdfPath);
