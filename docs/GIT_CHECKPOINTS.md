# Git checkpoint guide

Commit manually at real points in your work. Do not backdate commits. Run `npm run build` and `npm test` before checkpoints 3 to 5.

## 0. Setup
```bash
git init && git branch -M main
git remote add origin https://github.com/<you>/tiffinlab.git
```

## 1. Initial setup and business data
Files: `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `.gitignore`, `public/favicon.svg`, `src/main.jsx`, `src/data/meals.js`, `src/utils/format.js`
`git commit -m "Set up Vite React project and add 12-item TiffinLab menu data"`

## 2. Components, routes and browsing
Files: `src/App.jsx`, `src/components/{Navbar,Footer,StatusBanner,DataGate,MealCard,QuantityStepper}.jsx`, `src/pages/{HomePage,CatalogPage,MealDetailsPage,NotFoundPage}.jsx`, `src/services/mealLoader.js`, `src/hooks/useDocumentTitle.js`, `src/styles/global.css` (basic version)
`git commit -m "Add routes, async loader, catalogue with search, filters, sort and details page"`

## 3. Selection workflow, form and operating rules
Files: `src/rules/orderRules.js`, `src/context/OrderContext.jsx`, `src/utils/validation.js`, `src/components/OrderSummaryPanel.jsx`, `src/pages/{CheckoutPage,ConfirmationPage}.jsx`
`git commit -m "Add shared order state, checkout form, validation and three operating rules"`

## 4. Frontend improvements and responsive styling
Files: `src/components/{ConflictBanner,DemoControlsBar}.jsx`, compare table and URL filters in `CatalogPage.jsx`, final `src/styles/global.css`, `DECISIONS.md`
`git commit -m "Add comparison, URL-persisted filters, conflict recovery and 390px responsive styling"`

## 5. Edge cases, tests, documentation and deployment
Files: `tests/orderRules.test.js`, `README.md`, `vercel.json`, `netlify.toml`, `public/_redirects`, `docs/`
`git commit -m "Add rule tests, edge-case docs and SPA routing fallback for deployment"`

```bash
git push -u origin main
git rev-parse HEAD   # final commit hash for the report
```
