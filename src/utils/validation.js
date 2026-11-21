// Checkout form options and validation (FR09, FR10).
export const SECTORS = ['H-11', 'G-11', 'F-10', 'F-11', 'E-11', 'I-8', 'Blue Area'];
export const MODES = ['Delivery', 'Hub Pickup'];
export const WINDOWS = ['Lunch 12:30–14:00', 'Dinner 19:30–21:00'];
export const PROFILES = ['Standard', 'Mild / Sensitive', 'High-Protein Focus'];
export const NOTE_MAX = 120;

export const DEFAULT_FORM = {
  name: '',
  sector: '',
  mode: 'Delivery',
  window: WINDOWS[0],
  profile: 'Standard',
  note: '',
};

// Returns an object of field -> message. An empty object means the form is valid.
export function validateCheckoutForm(form) {
  const errors = {};
  if (form.name.trim().length < 2) {
    errors.name = 'Enter at least 2 characters for the name. A nickname is fine.';
  }
  if (form.mode === 'Delivery' && !SECTORS.includes(form.sector)) {
    errors.sector = 'Choose your Islamabad sector so we know where to deliver.';
  }
  if (!MODES.includes(form.mode)) errors.mode = 'Choose Delivery or Hub Pickup.';
  if (!WINDOWS.includes(form.window)) errors.window = 'Choose a delivery window.';
  if (!PROFILES.includes(form.profile)) errors.profile = 'Choose a dietary / spice profile.';
  if (form.note.length > NOTE_MAX) {
    errors.note = `Keep the note to ${NOTE_MAX} characters or fewer (currently ${form.note.length}).`;
  }
  return errors;
}
