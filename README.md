# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Bongo

## TODO — Admin marketplace gaps (do 2026-08-08)

Audit of the admin panel vs. sellers (teachers/tutors/schools), the marketplace, and sales.

**Already done ✅**
- Sellers review queue: verify type + registration number (TSC / school code / National ID) + location/school; approve / reject / suspend (`pending → active/rejected`).

**To add:**

### Sellers (teachers / tutors / schools)
- [ ] Earnings & payouts view — show each seller's `payoutBalancePending` / `payoutBalancePaid`, and a **record-payout** action (mark `ledger` rows settled → move pending → paid).
- [ ] Seller detail drill-in — their resources + sales.

### Marketplace (resources)
- [ ] **Resources moderation** section — list all resources, filter by seller/status, **unpublish / take down** content.
- [ ] (Optional) admin approval gate before publish (`pending → approved/rejected`), per the Phase-1 design.

### Sales (depends on the payments slice — spec: `docs/superpowers/specs/2026-08-07-marketplace-cart-checkout-wallet-design.md`)
- [ ] Sales / Orders view — `purchases` (buyer, item, amount, method, date).
- [ ] Commission ledger / revenue — platform + per-seller earnings from `ledger`.
- [ ] **Credit wallet** admin action (`creditWallet`) — top up a buyer's wallet.
- [ ] Platform settings — commission % (`platformSettings/marketplace`, default 15).

**Build order:** payments slice (brings Orders view, ledger, credit-wallet, commission setting) → resources moderation → seller payout/earnings view.
