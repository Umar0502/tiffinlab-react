import { MEALS } from '../data/meals.js';

// Asynchronous mock loader (FR14). Resolves with a fresh copy of the catalogue after a
// short delay. `shouldFail` and `empty` are driven by the Assignment Demo Controls.
export function loadMeals({ shouldFail = false, empty = false, latency = 800 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Demo failure: the menu service did not respond.'));
        return;
      }
      resolve(empty ? [] : MEALS.map((meal) => ({ ...meal })));
    }, latency);
  });
}
