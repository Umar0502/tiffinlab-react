// Pure business-rule functions. Imported by the React app AND by tests/orderRules.test.js.

export const MAX_PER_MEAL = 6;
export const MIN_DELIVERY_SUBTOTAL = 2500;
export const DELIVERY_FEE = 200;
export const MILD_PROFILE = 'Mild / Sensitive';

const pkr = (n) => `PKR ${Number(n).toLocaleString('en-US')}`;

// ---- Rule 1: availability / capacity (1 to 6 per meal, never above remainingSlots) ----
export function maxQuantityFor(remainingSlots) {
  return Math.max(0, Math.min(MAX_PER_MEAL, Number(remainingSlots) || 0));
}

export function validateQuantity(quantity, remainingSlots) {
  const max = maxQuantityFor(remainingSlots);
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, max, reason: 'below-minimum', message: 'Order at least 1 of each meal you add.' };
  }
  if (quantity > MAX_PER_MEAL) {
    return { valid: false, max, reason: 'over-limit', message: `Maximum ${MAX_PER_MEAL} per meal per order.` };
  }
  if (quantity > remainingSlots) {
    const left = Math.max(0, remainingSlots);
    return { valid: false, max, reason: 'over-slots', message: `Only ${left} batch slot${left === 1 ? '' : 's'} left for this meal.` };
  }
  return { valid: true, max, reason: null, message: '' };
}

export function quantityLimitLabel(remainingSlots) {
  const max = maxQuantityFor(remainingSlots);
  if (max === 0) return 'Sold out for this batch';
  return `Order 1 to ${max} per order (${remainingSlots} batch slot${remainingSlots === 1 ? '' : 's'} left)`;
}

export function findAvailabilityConflicts(lines) {
  return lines.flatMap(({ meal, quantity }) => {
    const result = validateQuantity(quantity, meal.remainingSlots);
    if (result.valid) return [];
    const message =
      result.max === 0
        ? `${meal.name} is sold out for this batch.`
        : `${meal.name}: you have ${quantity} but the limit is ${result.max}. ${result.message}`;
    return [{ mealId: meal.id, name: meal.name, quantity, max: result.max, message }];
  });
}

// ---- Rule 2: eligibility (Mild / Sensitive profile cannot include High Spice meals) ----
export function findSpiceConflicts(profile, lines) {
  if (profile !== MILD_PROFILE) return [];
  return lines
    .filter(({ meal }) => meal.highSpice === true)
    .map(({ meal }) => ({
      mealId: meal.id,
      name: meal.name,
      message: `${meal.name} is High Spice and cannot be in a Mild / Sensitive order.`,
    }));
}

// ---- Rule 3: pricing / fulfilment (delivery needs PKR 2,500 food subtotal, then PKR 200 fee) ----
export function evaluateFulfilment(mode, subtotal) {
  if (mode === 'Hub Pickup') {
    return { valid: true, fee: 0, shortfall: 0, message: 'Hub Pickup: no delivery fee and no minimum order.' };
  }
  if (mode === 'Delivery') {
    if (subtotal >= MIN_DELIVERY_SUBTOTAL) {
      return { valid: true, fee: DELIVERY_FEE, shortfall: 0, message: `Delivery fee of ${pkr(DELIVERY_FEE)} applies.` };
    }
    const shortfall = MIN_DELIVERY_SUBTOTAL - subtotal;
    return {
      valid: false,
      fee: 0,
      shortfall,
      message: `Delivery needs ${pkr(MIN_DELIVERY_SUBTOTAL)} of food. Add ${pkr(shortfall)} more or switch to Hub Pickup.`,
    };
  }
  return { valid: false, fee: 0, shortfall: 0, message: 'Choose Delivery or Hub Pickup.' };
}

export function calculateTotals(lines, mode) {
  const itemCount = lines.reduce((sum, { quantity }) => sum + quantity, 0);
  const subtotal = lines.reduce((sum, { meal, quantity }) => sum + meal.price * quantity, 0);
  const fulfilment = evaluateFulfilment(mode, subtotal);
  const deliveryFee = lines.length > 0 ? fulfilment.fee : 0;
  return { mode, itemCount, subtotal, deliveryFee, total: subtotal + deliveryFee, fulfilment };
}

// Combines all three rules into one verdict used by the summary panel and checkout.
export function evaluateOrder({ lines, profile, mode }) {
  const availability = findAvailabilityConflicts(lines);
  const spice = findSpiceConflicts(profile, lines);
  const totals = calculateTotals(lines, mode);
  const blockers = [];
  if (lines.length === 0) blockers.push('Your box is empty. Add at least one meal.');
  availability.forEach((c) => blockers.push(c.message));
  spice.forEach((c) => blockers.push(c.message));
  if (lines.length > 0 && !totals.fulfilment.valid) blockers.push(totals.fulfilment.message);
  return { valid: blockers.length === 0, availability, spice, fulfilment: totals.fulfilment, totals, blockers };
}
