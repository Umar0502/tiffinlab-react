# Frontend Decisions

Reference site: https://basilpantry.com/ (observed homepage; see the note at the end about what you must capture yourself).

What I observed on the reference homepage: it describes weekly / 15-day / monthly plans and says the menu is "customized" to the customer's BMI and preferences, but it lists no individual meals, prices or macros. Refund, hold and credit-expiry terms appear in an "Important Notice" and "Disclaimer" block near the bottom of the page, and payment details are in the FAQ.

---

## Decision 1: Browse and compare meals before committing (information hierarchy, mobile layout)

| Field | Content |
|---|---|
| **Problem** | The reference homepage gives no per-meal prices, macros or menu. A visitor cannot compare options before choosing a plan. |
| **Decision** | `/meals` shows every meal with price, calories, protein, spice badge and slots left on the card. A "Compare" checkbox opens a side-by-side table for 2 to 3 meals. On a 390 px screen the grid becomes one column and the table scrolls inside its own container. |
| **Alternative** | A single "customise your plan" wizard that reveals prices only after sign-up. |
| **Reason** | Students on a budget decide by price and protein. Showing them first removes a step and lets them find a suitable meal. |
| **Tradeoff** | Cards carry more text, and the comparison table needs horizontal scroll on narrow phones. |
| **Code location** | `src/components/MealCard.jsx` (`MealCard`), `src/pages/CatalogPage.jsx` (`CatalogContent`, compare table), `src/styles/global.css` (`.meal-grid`, `.table-scroll`). |
| **Evidence** | 1) Open `/meals` at 1280 px: price, macros and slots are visible on each card. 2) Tick Compare on three meals: the table appears under the list. 3) Resize to 390 px: one column, no page-wide horizontal scroll. Add your screenshots here. |

## Decision 2: Fees, minimums and slot limits in a persistent summary (information hierarchy)

| Field | Content |
|---|---|
| **Problem** | On the reference site, refund, hold, expiry and payment conditions sit in separate notice and FAQ blocks, away from where the customer chooses. Conditions are easy to miss until late. |
| **Decision** | The "Your box" panel is on the catalogue, details and checkout pages. It always shows item count, subtotal, delivery fee (or "PKR 0, PKR 200 applies at PKR 2,500"), total, and a fulfilment status line. Rule text is also beside each quantity control and on each details page. |
| **Alternative** | A rules/FAQ page linked from the footer. |
| **Reason** | The business goal is a completed order. Customers who see the PKR 2,500 delivery minimum and the 6-per-meal limit while choosing are less likely to be blocked at the end. |
| **Tradeoff** | On mobile the panel sits below the content, so it is not always visible while scrolling the list. The Checkout link in the nav shows the box count as a cue. |
| **Code location** | `src/components/OrderSummaryPanel.jsx` (`OrderSummaryPanel`), `src/rules/orderRules.js` (`evaluateOrder`, `evaluateFulfilment`), `src/components/QuantityStepper.jsx`. |
| **Evidence** | 1) Add one Student Weekly Bundle (PKR 3,200): the panel says fulfilment OK, fee PKR 200. 2) Remove it and add one Daal Chawal box (PKR 480): the panel says PKR 2,020 more is needed, with a "Switch to Hub Pickup" button. 3) Press "+" until the stepper disables at its limit. |

## Decision 3: Keep state and filters across navigation, and validate in place (interaction and state)

| Field | Content |
|---|---|
| **Problem** | The reference sign-up is a multi-step handoff to another page (`join-basil-family.html`), so context from the homepage does not carry over, and conflicts between choices would only show after steps are done. |
| **Decision** | One shared `OrderContext` holds the catalogue, box, form and status. Box and form are saved to `localStorage`. Search and filters live in the URL query string, so Back, Forward and refresh keep them. Selected meals hidden by a filter stay in the box and are announced. Conflicts (spice, slots, minimum) show inline with a one-click fix. |
| **Alternative** | Keep filters in component state and only validate on submit. |
| **Reason** | Customers can compare across categories without losing selections, and fix problems where they appear instead of repeating work. |
| **Tradeoff** | More logic: stored data must be sanitised and re-checked against current data, and URL-driven filters need care so typing does not flood browser history (`replace: true` is used). |
| **Code location** | `src/context/OrderContext.jsx` (`OrderProvider`, `sanitizeCart`, `fixQuantities`), `src/pages/CatalogPage.jsx` (`setParam`, `hiddenSelected`), `src/components/ConflictBanner.jsx`, `src/pages/CheckoutPage.jsx` (`handleSubmit`). |
| **Evidence** | 1) Add a meal, set a category filter, open a meal, press Back: filter is still applied. 2) Filter so the added meal is hidden: a notice reports it is still in the box. 3) Refresh: box is restored. 4) Open demo controls, press "Simulate slot drop": a warning banner appears; "Adjust my box" fixes it. |

---

**Before you submit:** the Problem rows describe what I saw on the reference homepage text. You must verify them yourself on the live site (including the `join-basil-family.html` sign-up flow), capture your own screenshots with URLs and steps, and write the "possible business consequence" for the report. Keep what you observed separate from what you infer.
