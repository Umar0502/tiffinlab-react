import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateQuantity,
  evaluateFulfilment,
  findSpiceConflicts,
  calculateTotals,
} from '../src/rules/orderRules.js';

// Rule 1: 1 to 6 per meal and never above remainingSlots.
test('Rule 1: ordinary quantity is valid', () => {
  const result = validateQuantity(3, 8);
  assert.equal(result.valid, true);
  assert.equal(result.max, 6);
});

test('Rule 1: exactly at the limit (6 with 6 slots) is valid', () => {
  const result = validateQuantity(6, 6);
  assert.equal(result.valid, true);
  assert.equal(result.max, 6);
});

test('Rule 1: 7 is rejected even with plenty of slots', () => {
  const result = validateQuantity(7, 10);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'over-limit');
});

test('Rule 1: quantity above remaining slots is rejected', () => {
  const result = validateQuantity(4, 3);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'over-slots');
  assert.equal(result.max, 3);
});

// Rule 3 boundary: PKR 2,500 passes, PKR 2,499 fails with the exact shortfall.
test('Rule 3: delivery at exactly PKR 2,500 is allowed with a PKR 200 fee', () => {
  const result = evaluateFulfilment('Delivery', 2500);
  assert.deepEqual([result.valid, result.fee], [true, 200]);
});

test('Rule 3: delivery at PKR 2,499 is blocked and reports PKR 1 short', () => {
  const result = evaluateFulfilment('Delivery', 2499);
  assert.equal(result.valid, false);
  assert.equal(result.shortfall, 1);
});

test('Rule 3: Hub Pickup has no minimum and no fee', () => {
  const lines = [{ meal: { price: 350 }, quantity: 1 }];
  const totals = calculateTotals(lines, 'Hub Pickup');
  assert.equal(totals.deliveryFee, 0);
  assert.equal(totals.total, 350);
});

// Rule 2: Mild / Sensitive blocks High Spice meals.
test('Rule 2: Mild profile flags High Spice meals only', () => {
  const lines = [
    { meal: { id: 'a', name: 'Hot', highSpice: true }, quantity: 1 },
    { meal: { id: 'b', name: 'Mild', highSpice: false }, quantity: 1 },
  ];
  assert.equal(findSpiceConflicts('Mild / Sensitive', lines).length, 1);
  assert.equal(findSpiceConflicts('Standard', lines).length, 0);
});
