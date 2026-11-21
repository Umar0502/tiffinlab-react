import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadMeals } from '../services/mealLoader.js';
import { evaluateOrder, maxQuantityFor, MILD_PROFILE } from '../rules/orderRules.js';
import { DEFAULT_FORM } from '../utils/validation.js';

const CART_KEY = 'tiffinlab.cart.v1';
const FORM_KEY = 'tiffinlab.form.v1';
const ORDER_KEY = 'tiffinlab.lastOrder.v1';

// ---- localStorage helpers: never throw, never trust stored data (FR13) ----
function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be full or blocked; the app keeps working in memory */
  }
}
function sanitizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i) => i && typeof i.id === 'string' && Number.isInteger(i.quantity) && i.quantity > 0)
    .map(({ id, quantity }) => ({ id, quantity }));
}
function sanitizeForm(raw) {
  const form = { ...DEFAULT_FORM };
  if (raw && typeof raw === 'object') {
    Object.keys(DEFAULT_FORM).forEach((key) => {
      if (typeof raw[key] === 'string') form[key] = raw[key];
    });
  }
  return form;
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [baseMeals, setBaseMeals] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [demo, setDemo] = useState({ failLoad: false, emptyCatalog: false });
  const [slotOverrides, setSlotOverrides] = useState({});
  const [cart, setCart] = useState(() => sanitizeCart(readStorage(CART_KEY, [])));
  const [form, setForm] = useState(() => sanitizeForm(readStorage(FORM_KEY, null)));
  const [lastOrder, setLastOrder] = useState(() => readStorage(ORDER_KEY, null));

  // Load the catalogue asynchronously; cancel stale responses on cleanup.
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setErrorMessage('');
    loadMeals({ shouldFail: demo.failLoad, empty: demo.emptyCatalog })
      .then((data) => {
        if (cancelled) return;
        setBaseMeals(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey, demo.failLoad, demo.emptyCatalog]);

  useEffect(() => writeStorage(CART_KEY, cart), [cart]);
  useEffect(() => writeStorage(FORM_KEY, form), [form]);
  useEffect(() => writeStorage(ORDER_KEY, lastOrder), [lastOrder]);

  // ---- Derived values ----
  const meals = useMemo(
    () =>
      baseMeals.map((meal) =>
        meal.id in slotOverrides
          ? { ...meal, remainingSlots: Math.min(meal.remainingSlots, slotOverrides[meal.id]) }
          : meal
      ),
    [baseMeals, slotOverrides]
  );
  const mealsById = useMemo(() => Object.fromEntries(meals.map((m) => [m.id, m])), [meals]);
  const lines = useMemo(
    () =>
      status === 'ready'
        ? cart.flatMap((item) => (mealsById[item.id] ? [{ meal: mealsById[item.id], quantity: item.quantity }] : []))
        : [],
    [cart, mealsById, status]
  );
  const missingItems = useMemo(
    () => (status === 'ready' ? cart.filter((item) => !mealsById[item.id]) : []),
    [cart, mealsById, status]
  );
  const evaluation = useMemo(
    () => evaluateOrder({ lines, profile: form.profile, mode: form.mode }),
    [lines, form.profile, form.mode]
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const slotDropActive = Object.keys(slotOverrides).length > 0;

  // ---- Actions ----
  // Rule 1 is applied here: increments are clamped to min(6, remainingSlots).
  const changeQuantity = useCallback(
    (id, delta) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === id);
        const current = existing ? existing.quantity : 0;
        const meal = mealsById[id];
        const max = meal ? maxQuantityFor(meal.remainingSlots) : 0;
        const next = delta > 0 ? Math.min(current + delta, max) : current + delta;
        if (next <= 0) return prev.filter((item) => item.id !== id);
        if (existing) return prev.map((item) => (item.id === id ? { ...item, quantity: next } : item));
        return [...prev, { id, quantity: next }];
      });
    },
    [mealsById]
  );
  const increment = (id) => changeQuantity(id, 1);
  const decrement = (id) => changeQuantity(id, -1);
  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  // One-click recovery: clamp to current limits and drop items that are gone or sold out.
  const fixQuantities = () =>
    setCart((prev) =>
      prev.flatMap((item) => {
        const meal = mealsById[item.id];
        const max = meal ? maxQuantityFor(meal.remainingSlots) : 0;
        return max < 1 ? [] : [{ ...item, quantity: Math.min(item.quantity, max) }];
      })
    );

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const switchToStandardProfile = () => updateForm('profile', 'Standard');
  const switchToPickup = () => updateForm('mode', 'Hub Pickup');

  const retryLoad = () => setReloadKey((k) => k + 1);
  const setDemoFlag = (flag, value) => setDemo((prev) => ({ ...prev, [flag]: value }));
  const toggleSlotDrop = () =>
    setSlotOverrides((prev) =>
      Object.keys(prev).length > 0
        ? {}
        : Object.fromEntries(cart.map((item) => [item.id, Math.max(0, item.quantity - 1)]))
    );

  const placeOrder = () => {
    const order = {
      id: `TL-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      items: lines.map(({ meal, quantity }) => ({ id: meal.id, name: meal.name, quantity, unitPrice: meal.price })),
      totals: { ...evaluation.totals, fulfilment: undefined },
      details: {
        name: form.name.trim(),
        sector: form.sector,
        mode: form.mode,
        window: form.window,
        profile: form.profile,
        note: form.note.trim(),
      },
    };
    setLastOrder(order);
    setCart([]);
    return order;
  };
  const startNewOrder = () => setLastOrder(null);

  const value = {
    status, errorMessage, meals, mealsById, cart, cartCount, lines, missingItems, evaluation, form,
    lastOrder, demo, slotDropActive,
    increment, decrement, removeItem, fixQuantities, updateForm, switchToStandardProfile, switchToPickup,
    retryLoad, setDemoFlag, toggleSlotDrop, placeOrder, startNewOrder,
    isMildProfile: form.profile === MILD_PROFILE,
  };
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>');
  return ctx;
}

// Props for <OrderSummaryPanel>: parents own the state and hand data + callbacks down.
export function usePanelProps() {
  const o = useOrder();
  return {
    lines: o.lines,
    evaluation: o.evaluation,
    onIncrement: o.increment,
    onDecrement: o.decrement,
    onRemove: o.removeItem,
    onSwitchProfile: o.switchToStandardProfile,
    onSwitchToPickup: o.switchToPickup,
    profile: o.form.profile,
  };
}
