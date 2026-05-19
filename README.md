# QA Hackathon — Playwright MCP Workflow

End-to-end QA workflow driven by GitHub Copilot Agent + Playwright MCP server.
Generates test cases, automates them, logs defects, and writes a test strategy doc.

---

## Setup (one-time)

```powershell
cd automation
npm install
npx playwright install chromium
```

Open the project root (`qa-hackathon/`) in VS Code. The `.vscode/mcp.json` registers the Playwright MCP server automatically.

In VS Code: open Copilot Chat → switch the mode dropdown to **Agent**. You should see Playwright tools appear in the tool picker (browser_navigate, browser_click, browser_snapshot, etc.).

---

## Target URL

Default: **https://demo.opencart.com** (configured in `automation/playwright.config.ts`).
On the day of the hackathon, edit `baseURL` in `automation/playwright.config.ts` to point to the hackathon-provided URL.

---

## Workflow (copy-paste these prompts into Copilot Agent)

### Phase 1 — Generate Test Cases

> Use the Playwright MCP to explore https://demo.opencart.com. Identify all major user flows (registration, login, product search, cart, checkout, etc.). Generate comprehensive test cases following the rules in `.github/copilot-instructions.md` and append them to `testcases.csv`. Cover happy path, negative, boundary, and edge cases.

### Phase 2 — Manual Review

Open `testcases.csv` in Excel or VS Code. Team reviews, edits, removes duplicates, adds missing cases.

### Phase 3 — Automate + Find Bugs

> Read `testcases.csv`. Generate Playwright spec files under `automation/tests/` (one per module). Use the Playwright MCP to explore locators and produce robust tests. Then run `npx playwright test` from the `automation/` folder. For every failure or unexpected behavior, append a defect row to `defects.csv` per the rules in `.github/copilot-instructions.md`.

### Phase 4 — Generate Strategy

> Read `testcases.csv`, `defects.csv`, and `automation/tests/`. Write `strategy.md` with Functional Test Strategy and Automation Test Strategy sections per the rules in `.github/copilot-instructions.md`.

---

## File Layout

```
qa-hackathon/
├── .vscode/mcp.json              ← Playwright MCP server registration
├── .github/copilot-instructions.md ← Agent workflow rules
├── spec/                          ← drop spec files here
├── testcases.csv                  ← test cases (headers ready)
├── defects.csv                    ← defects (headers ready)
├── strategy.md                    ← generated in Phase 4
└── automation/
    ├── package.json
    ├── playwright.config.ts       ← edit baseURL on the day
    ├── tsconfig.json
    └── tests/                     ← AI fills this
```

---

## Day-of Adjustments (~5 minutes)

1. Update `baseURL` in `automation/playwright.config.ts` to the hackathon URL.
2. If the hackathon provides specific CSV column headers different from these defaults, update them in:
   - `testcases.csv` (top row)
   - `defects.csv` (top row)
   - `.github/copilot-instructions.md` (CSV Schemas section)
3. Drop the spec file(s) into `spec/`.
4. Start Phase 1.

---

## Troubleshooting

- **MCP tools don't appear in Copilot Agent**: Restart VS Code. Verify `.vscode/mcp.json` exists. Confirm you're in Agent mode (not Ask or Edit).
- **`npx playwright test` fails with browser not installed**: Run `npx playwright install chromium` from `automation/`.
- **CSV gets corrupted**: Make sure agent uses proper quoting. Keep a backup of the CSV before each phase.
