# Shopwise — Amazon Shopping Assistant

A Chromium Manifest V3 browser extension that reads selected product details from the Amazon product page currently open in the active tab.

## Phase 1 scope

The first phase establishes the extension foundation and local product extraction workflow:

- React popup built with JavaScript and Vite
- Chrome/Chromium Extension Manifest V3
- JavaScript content script for Amazon.in and Amazon.com product pages
- Extraction of product title, ASIN, displayed price, rating, ratings count, brand, image URL, and up to six feature bullets
- Product image preview and expandable product title in the popup
- One-click copy for the product ASIN
- Explicit HTTPS hostname validation for the supported Amazon marketplaces
- Automated tests for the Amazon URL validation utility
- Local page extraction; product details are not sent to a backend in Phase 1

## Technology stack

| Area | Technology |
| --- | --- |
| Extension UI | React + JavaScript |
| Build tool | Vite |
| Extension platform | Chrome Extension Manifest V3 |
| Page extraction | JavaScript content script |
| URL validation tests | Node.js built-in test runner |
| Backend/database | Not included in Phase 1 |

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- Google Chrome or a Chromium-based browser that supports unpacked Manifest V3 extensions (Opera is the initial test browser)

## Installation and build

```bash
npm install
npm run build
```

Vite generates the unpacked extension in `dist/`. The build copies the extension manifest and content script from `public/` into that directory.

## Load the extension

1. Open `chrome://extensions` or `opera://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project's `dist` folder, not the repository root.
5. Open an individual product detail page on Amazon.in or Amazon.com.
6. Refresh that product page after installing or reloading the extension.
7. Open the Shopwise extension popup to inspect the extracted details.

## Development and verification

Run the Vite development server for popup UI work:

```bash
npm run dev
```

Run the automated URL validation tests:

```bash
npm test
```

Create a production extension build:

```bash
npm run build
```

After changing extension code, rebuild and click the reload icon for Shopwise on the browser's extensions page. Refresh the Amazon product tab before reopening the popup so the updated content script is loaded.

## Current limitations

- Amazon can change its page markup, so individual fields may be unavailable on some listings.
- Price, rating, and ratings count are read from the currently displayed page and are not independently verified.
- Product images are loaded from the image URL present in the Amazon page; unavailable or non-HTTPS image URLs fall back to a placeholder.
- Only Amazon.in and Amazon.com are configured initially.
- The extension does not crawl Amazon, bypass CAPTCHAs, or circumvent access restrictions.
- Phase 1 does not include review collection, product comparison, price history, a backend, MySQL persistence, accounts, or LLM integration.

## Privacy and permissions

The extension uses the active tab to request product details from the supported Amazon page. The `clipboardWrite` permission is used only when the user clicks the Copy button for the ASIN. Phase 1 does not transmit extracted product data to a server or store it in a remote database.

## Planned development phases

- **Phase 1 — Foundation:** Browser extension, product-page detection, and local product extraction.
- **Phase 2 — Comparison engine:** Normalized product data and deterministic product comparison.
- **Phase 3 — Backend and AI:** FastAPI, MySQL persistence, and LLM-backed explanations.
- **Phase 4 — Recommendation intelligence:** Shopping preferences, review intelligence, and explainable recommendations.
- **Phase 5 — Release readiness:** Broader testing, deployment, security review, and final documentation.
