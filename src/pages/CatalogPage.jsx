import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useOrder, usePanelProps } from '../context/OrderContext.jsx';
import { CATEGORIES, DIETARY_TAGS } from '../data/meals.js';
import { formatPKR } from '../utils/format.js';
import DataGate from '../components/DataGate.jsx';
import MealCard from '../components/MealCard.jsx';
import OrderSummaryPanel from '../components/OrderSummaryPanel.jsx';
import StatusBanner from '../components/StatusBanner.jsx';

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'protein-desc': 'Protein: high to low',
  'slots-desc': 'Availability: most slots',
};

function CatalogContent() {
  const { meals, cart, increment, decrement, removeItem } = useOrder();
  const panelProps = usePanelProps();
  const [params, setParams] = useSearchParams();
  const [compareIds, setCompareIds] = useState([]);

  // Filters live in the URL so Back/Forward and refresh keep them (Decision 3).
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const tag = params.get('tag') ?? 'all';
  const mildOnly = params.get('mild') === '1';
  const sort = params.get('sort') ?? 'featured';

  const setParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === 'all' || value === 'featured') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  const resetFilters = () => setParams({}, { replace: true });

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = meals.filter((m) => {
      if (category !== 'all' && m.category !== category) return false;
      if (tag !== 'all' && !m.tags.includes(tag)) return false;
      if (mildOnly && m.highSpice) return false;
      if (!term) return true;
      return [m.name, m.description, ...m.ingredients, ...m.tags].join(' ').toLowerCase().includes(term);
    });
    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'protein-desc': (a, b) => b.protein - a.protein,
      'slots-desc': (a, b) => b.remainingSlots - a.remainingSlots,
    };
    return sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered;
  }, [meals, q, category, tag, mildOnly, sort]);

  const qtyById = Object.fromEntries(cart.map((i) => [i.id, i.quantity]));
  const hiddenSelected = cart.filter((i) => !results.some((m) => m.id === i.id));
  const toggleCompare = (id) =>
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev));
  const compared = compareIds.map((id) => meals.find((m) => m.id === id)).filter(Boolean);

  if (meals.length === 0) {
    return (
      <StatusBanner tone="info" title="The menu is empty right now">
        <p>No meals are published at the moment. Check back later, or turn off “Simulate empty catalogue” in the demo controls.</p>
      </StatusBanner>
    );
  }

  return (
    <div className="layout-two">
      <div>
        <form className="filters" role="search" onSubmit={(e) => e.preventDefault()} aria-label="Search and filter meals">
          <div className="field field-wide">
            <label htmlFor="search">Search meals</label>
            <input id="search" type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Try chicken, daal or paneer" />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setParam('category', e.target.value)}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tag">Dietary tag</label>
            <select id="tag" value={tag} onChange={(e) => setParam('tag', e.target.value)}>
              <option value="all">All tags</option>
              {DIETARY_TAGS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
              {Object.entries(SORTS).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>
          </div>
          <label className="check field-check">
            <input type="checkbox" checked={mildOnly} onChange={(e) => setParam('mild', e.target.checked ? '1' : '')} />
            Hide High Spice meals
          </label>
        </form>

        <p className="result-count" aria-live="polite">Showing {results.length} of {meals.length} meals</p>

        {hiddenSelected.length > 0 && (
          <StatusBanner tone="info" title={`${hiddenSelected.length} meal${hiddenSelected.length === 1 ? '' : 's'} in your box ${hiddenSelected.length === 1 ? 'is' : 'are'} hidden by these filters`}>
            <p>They are still in your box and in the totals. <button type="button" className="link-button" onClick={resetFilters}>Reset filters</button> to see them.</p>
          </StatusBanner>
        )}

        {results.length === 0 ? (
          <div className="empty-state">
            <h2>No meals match these filters</h2>
            <p>Try a different search term, or remove a filter. The menu has {meals.length} meals in total.</p>
            <button type="button" className="btn btn-primary" onClick={resetFilters}>Reset filters</button>
          </div>
        ) : (
          <ul className="meal-grid">
            {results.map((meal) => (
              <li key={meal.id}>
                <MealCard
                  meal={meal}
                  quantity={qtyById[meal.id] ?? 0}
                  onAdd={increment}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={removeItem}
                  compareChecked={compareIds.includes(meal.id)}
                  compareDisabled={compareIds.length >= 3}
                  onToggleCompare={toggleCompare}
                />
              </li>
            ))}
          </ul>
        )}

        <section className="section" aria-labelledby="compare-heading">
          <h2 id="compare-heading">Compare meals</h2>
          {compared.length < 2 ? (
            <p className="hint">Tick “Compare” on 2 or 3 meals to see them side by side.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Side-by-side comparison of selected meals</caption>
                <thead>
                  <tr><th scope="col">Detail</th>{compared.map((m) => (<th scope="col" key={m.id}><Link to={`/meals/${m.id}`}>{m.name}</Link></th>))}</tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Price</th>{compared.map((m) => (<td key={m.id}>{formatPKR(m.price)}</td>))}</tr>
                  <tr><th scope="row">Calories</th>{compared.map((m) => (<td key={m.id}>{m.calories} kcal</td>))}</tr>
                  <tr><th scope="row">Protein</th>{compared.map((m) => (<td key={m.id}>{m.protein} g</td>))}</tr>
                  <tr><th scope="row">Carbs / fat</th>{compared.map((m) => (<td key={m.id}>{m.carbs} g / {m.fat} g</td>))}</tr>
                  <tr><th scope="row">Spice</th>{compared.map((m) => (<td key={m.id}>{m.highSpice ? 'High Spice' : 'Not High Spice'}</td>))}</tr>
                  <tr><th scope="row">Batch slots left</th>{compared.map((m) => (<td key={m.id}>{m.remainingSlots}</td>))}</tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <aside aria-label="Order summary" className="sticky-aside">
        <OrderSummaryPanel {...panelProps} showCheckoutLink />
      </aside>
    </div>
  );
}

export default function CatalogPage() {
  useDocumentTitle('Meals');
  return (
    <>
      <h1>Meals and bundles</h1>
      <p className="lead">Every price, macro and slot limit is shown before you add anything.</p>
      <DataGate><CatalogContent /></DataGate>
    </>
  );
}
