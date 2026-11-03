# StockMate — Web UI Prototype

The StockMate prototype uses plain HTML/CSS/JavaScript for US01–US14, with a desktop layout, role-based sidebar navigation and a green color palette. Documentation is in English; the prototype UI and screenshot contents remain in Vietnamese.

## Open the prototype

Open [index.html](./index.html) in Edge, Chrome or Firefox. No library installation, build or internet connection is required; fonts and assets are local. Use the same browser and URL to retain sample data. If localStorage is blocked for local files, use the HTTP server below.

With Node.js installed, run from the repository root:

```sh
node docs/ui_ux/prototype/serve.mjs
```

Open **http://127.0.0.1:4173**. Set the `PORT` environment variable if needed. The server listens locally only. Stop it with Ctrl+C.

## Accounts and sign-in

The initial login screen has empty fields, with no sample credentials or autofill buttons. The following accounts are for technical testing only; enter them manually to explore workflows. All four use the sample password **StockMate123!**:

| Username | Role | Landing page |
|---|---|---|
| admin | Admin | Account administration |
| staff | Warehouse Staff | Inventory |
| planner | Inventory Planner | Inventory |
| manager | Manager | Dashboard |

Sign out and sign in with another account to test a different role. URL parameters do not change session permissions. Admin has no inventory/proposal business permissions by default.

Admin can create/edit accounts, filter by role/status, lock/unlock accounts and issue temporary passwords. Usernames are unique and immutable; accounts are not hard-deleted. Created/reset accounts must change their temporary password at the next login. There is no public registration or recovery email. Admin cannot lock or demote their own account; at least one active Admin must remain.

Passwords require 8–128 characters. Changing a password requires the current password, matching confirmation and a different new password. Sessions are stored in sessionStorage per tab; accounts and password verifiers are stored in localStorage. Locking, role changes and password resets revoke earlier sessions through `auth_version`. A password change creates a replacement session for the current tab.

**Reset sample data** asks for confirmation and restores business data while retaining accounts/passwords. To restore all default accounts, clear site data in Developer Tools and reload; this loses local changes. Do not use real credentials.

## Source structure

```text
prototype/
├── index.html              Browser entry point
├── styles.css              Layout, colors and responsive styles
├── app.js                  Sample data, calculations and interactions
├── auth.js                 Accounts, password verifiers and demo sessions
├── account-views.js        Login, password-change and Admin screens
├── serve.mjs               Optional dependency-free Node.js HTTP server
├── verify.mjs              Playwright workflow checks and sample captures
├── capture-all.mjs         Full screenshot capture by role
├── screenshot-gallery.mjs  Image numbering, folders and catalog generation
├── verification.json       Latest workflow verification results
└── screenshots/            PNGs, screen catalogs and manifests
```

The [UI/UX Walkthrough](../UI_UX_WALKTHROUGH.md) uses 10 representative screenshots.

The [complete screen catalog](./screenshots/SCREENSHOT_INDEX.md) includes [Common](./screenshots/common/COMMON_SCREENS.md), [Admin](./screenshots/admin/ADMIN_SCREENS.md), [Warehouse Staff](./screenshots/warehouse_staff/WAREHOUSE_STAFF_SCREENS.md), [Planner](./screenshots/planner/PLANNER_SCREENS.md) and [Manager](./screenshots/manager/MANAGER_SCREENS.md). Each list includes a number, screen name, type and route; select a name to view its image. Shared screens are in `common`; warehouse staff screens use `warehouse_staff`.

## Workflows to explore

- Accounts: sign in/out, change passwords, check locked accounts and access restrictions.
- Admin: search/filter, create/edit, lock/unlock, issue temporary passwords and view account activity.
- Warehouse Staff: search, inspect products, receive against orders, record direct sales/backorder deliveries, count stock and inspect quantities, reasons and history.
- Planner: analyze 30-day demand, filter sales history, check alerts, prepare multi-product/multi-supplier proposals, edit quantities/prices/budgets and save/submit drafts.
- Simulated AI: explain calculations, suggest quantities, apply them to drafts and simulate failure while retaining forms. No real AI model is called.
- Manager: inspect the dashboard and proposals, approve/reject with a reason, and view final decisions without deciding twice.
- Planner: copy rejected proposals, maintain products/suppliers/prices/policies, record actual placed orders/backorders and cancel outstanding quantities.

## Data and limitations

- One warehouse, VND amounts and integer quantities in each SKU's unit. The fixture contains five SKUs.
- The business date is fixed at **2 November 2026** for reproducible images/examples. Demand uses **3 October–1 November 2026**, the last 30 completed days. History filters do not change that window. New transactions use 2 November 2026; action timestamps use real time in Asia/Ho_Chi_Minh. The demo clock does not advance automatically.
- Sample history records daily sales totals. Data-completeness status is part of the fixture; new products default to missing history. There is no screen for confirming imported sales-data completeness.
- Local JavaScript calculations illustrate business rules. Production needs authoritative backend calculations and access checks. Accounts use salted PBKDF2 verifiers, but client-side checks do not provide production authentication security. The backend must hash passwords appropriately and validate every request.
- localStorage is limited to one browser/origin. Tabs have independent sessionStorage sessions, but there is no cross-device synchronization, concurrency locking or database. Use a browser mode that permits localStorage.
- No API is connected. Demo sessions follow the tab lifecycle rather than the proposed eight-hour backend token expiry. There is no automatic ordering, email or payment. Manual replenishment checks work; daily scheduling requires a backend.
- Proposal prices/names/units are snapshots. Copying rejected proposals retrieves current data. Quantities are not changed automatically or reduced to fit a budget.

## Verification and screenshot capture

Requires Node.js, Playwright and an installed Edge browser. If Playwright is unavailable, install the verification dependency with `npm install --no-save playwright` in the prototype folder. The UI itself does not require it.

Keep the preview server running in one terminal, then run in another:

```sh
node docs/ui_ux/prototype/verify.mjs --capture
```

Without `--capture`, this only verifies workflows. The script uses an isolated browser context and resets fixtures between images, leaving the user's browser data untouched. Results are saved to `verification.json`; representative image roles/routes are recorded in `screenshots/manifest.json`.

Optional environment variables: `PLAYWRIGHT_MODULE` (installed module path), `BROWSER_PATH` (another Chromium executable) and `PROTOTYPE_URL` (default `http://127.0.0.1:4173`). Representative capture creates 10 full-page desktop images at 1440×1000. The 390×844 mobile layout is checked without additional captures. Some full-page images are taller than the viewport.

To capture the full role-based gallery, keep the server running and execute:

```sh
node docs/ui_ux/prototype/capture-all.mjs
```

This uses the same environment variables, captures full-page desktop images at 1440×1000 in `screenshots/common/` and role folders, and numbers images from 01 in functional order. It generates `SCREENSHOT_INDEX.md`, `*_SCREENS.md` and `roles-manifest.json`, without gallery README files. Catalog text is generated in English; captured UI remains Vietnamese.

Shared screens use one representative role. The prototype login role remains `staff`; its screenshot folder is `warehouse_staff`. Each image uses an isolated browser context. Capture covers existing layouts, dialogs and key states with representative data rather than every SKU/input combination. The 10 representative images and their `manifest.json` are retained. Access-denied images are marked separately and do not represent granted permissions.

Requirements: [Project README](../../../README.md), [Information Architecture](../../information_architecture/INFORMATION_ARCHITECTURE.md), [Business Rules](../../requirements/BUSINESS_RULES.md).
