# TiffinLab

**Student:** _Name_ · **Roll No:** _23I2022_ · **Section:** _A_ · **Course:** CS4032 Web Programming, Assignment 02 (Fall 2026)

- **GitHub:** _https://github.com/Umar0502/tiffinlab_
- **Deployment:**_https://tiffinlab-react-iota.vercel.app/_
- **Final commit hash:** 5380c95f2dd2ae0e26c92e5a9127b48c53af7fc4

## Description
TiffinLab is a fictional meal-prep service for students and professionals in Islamabad. Customers browse 12 meals and weekly bundles, search and filter, open a details page, build a box, enter delivery details, review a calculated summary and reach a confirmation. **All operations are simulated.** No payment, no real orders, no data leaves the browser.

## Commands
```bash
npm install        # install dependencies
npm run dev        # development server
npm run build      # production build to dist/
npm run preview    # serve the build locally
npm test           # node --test (same as: node --test)
```

## Routes
| Route | Purpose |
|---|---|
| `/` | Landing page and rule summary |
| `/meals` | Search, filter, sort, compare, add to box |
| `/meals/:id` | Details, e.g. `/meals/tl-01`; invalid IDs show a not-found state |
| `/checkout` | Controlled form, validation, live summary |
| `/confirmation` | Simulated receipt |
| `*` | Not-found page |

SPA fallback for refreshes on nested routes: `vercel.json`, `netlify.toml`, `public/_redirects`.

## Operating rules (`src/rules/orderRules.js`)
1. **Capacity:** 1 to 6 per meal and never above `remainingSlots`. Boundary: 6 with 6 slots is valid; 7 is not.
2. **Eligibility:** a `Mild / Sensitive` profile cannot include `highSpice` meals.
3. **Fulfilment:** Delivery needs a food subtotal of at least PKR 2,500, then a PKR 200 fee. PKR 2,499 is blocked ("PKR 1 more"). Hub Pickup has no minimum and no fee.

## Reproducing edge cases
Open "Assignment demo controls" (under the header).
- **Loading failure:** tick "Simulate data load error". The error and **Retry** appear. Untick, then press Retry.
- **Empty dataset:** tick "Simulate empty catalogue" to see the empty-menu state. A search with no matches shows a different state with "Reset filters".
- **Changed availability:** add meals, press "Simulate slot drop". A warning banner and per-line messages appear; "Adjust my box" fixes them. "Restore slots" undoes it.
- **Restored selection:** add meals, refresh; the box is restored and re-checked against current data. Editing `localStorage["tiffinlab.cart.v1"]` to a quantity of 9 or an unknown ID triggers the same recovery.
- **Invalid URL:** `/meals/zzz` or `/nope`.
- **Spice conflict:** add Chicken Karahi, choose "Mild / Sensitive" at checkout.

## Simulated operations and limitations
- Orders, receipts, slots and payment are simulated; slot counts are static data and are not reduced after an order.
- Names are stored in `localStorage` for convenience; use a nickname.
- Images are generated SVG illustrations, not photographs.
- Hub pickup location (H-11) is fictional.

## Concept map
| Concept | File | Component / function |
|---|---|---|
| `useState` | `src/context/OrderContext.jsx` | `OrderProvider` (cart, form, status) |
| Controlled inputs | `src/pages/CheckoutPage.jsx` | `CheckoutForm` |
| Functional updates | `src/context/OrderContext.jsx` | `changeQuantity`, `fixQuantities`, `updateForm` |
| Immutable arrays / objects | same | `filter`, `map`, spread in `changeQuantity`, `updateForm` |
| `useEffect` + cleanup | `OrderProvider`; `src/hooks/useDocumentTitle.js` | load effect with `cancelled` flag; title restore |
| Derived values | `OrderContext.jsx` | `meals`, `lines`, `evaluation` (`useMemo`) |
| Async promises | `src/services/mealLoader.js` | `loadMeals` (`.then/.catch` in the provider) |
| `localStorage` | `OrderContext.jsx` | `readStorage`, `writeStorage`, `sanitizeCart` |
| Routing / params | `src/App.jsx`, `MealDetailsPage.jsx`, `CatalogPage.jsx` | `Routes`, `useParams`, `useSearchParams` |
| Props and callback props | `OrderSummaryPanel.jsx`, `MealCard.jsx`, `QuantityStepper.jsx` | `onIncrement`, `onRemove`, ... |
| Conditional rendering | `DataGate.jsx`, `CatalogPage.jsx` | loading / error / empty / no-match |
| Business rules + test | `src/rules/orderRules.js`, `tests/orderRules.test.js` | `validateQuantity`, `evaluateFulfilment` |

## Automated test
`node --test` runs `tests/orderRules.test.js` (8 cases: valid, exact limit, over limit, over slots, PKR 2,500 / 2,499, pickup, spice). Record the result in your report.
