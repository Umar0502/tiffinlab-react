import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useOrder, usePanelProps } from '../context/OrderContext.jsx';
import { MODES, NOTE_MAX, PROFILES, SECTORS, WINDOWS, validateCheckoutForm } from '../utils/validation.js';
import { MILD_PROFILE } from '../rules/orderRules.js';
import DataGate from '../components/DataGate.jsx';
import OrderSummaryPanel from '../components/OrderSummaryPanel.jsx';

function CheckoutForm() {
  const { form, updateForm, evaluation, cart, placeOrder } = useOrder();
  const panelProps = usePanelProps();
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const summaryRef = useRef(null);

  const errors = useMemo(() => validateCheckoutForm(form), [form]);
  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const err = (field) => ((touched[field] || attempted) ? errors[field] : undefined);
  const blocked = Object.keys(errors).length > 0 || !evaluation.valid;

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);
    if (blocked) {
      // Wait for the error summary to render, then move focus to it.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    placeOrder();
    navigate('/confirmation');
  }

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your box is empty</h2>
        <p>Add at least one meal before checking out.</p>
        <Link to="/meals" className="btn btn-primary">Browse meals</Link>
      </div>
    );
  }

  const spiceProblem = form.profile === MILD_PROFILE && evaluation.spice.length > 0;
  const inputProps = (field) => ({
    id: field,
    'aria-invalid': err(field) ? 'true' : undefined,
    'aria-describedby': err(field) ? `${field}-error` : undefined,
    onBlur: () => touch(field),
  });
  const FieldError = ({ field }) => (err(field) ? <p id={`${field}-error`} className="error-text"><strong>Error:</strong> {errors[field]}</p> : null);

  return (
    <div className="layout-two">
      <form onSubmit={handleSubmit} noValidate aria-label="Delivery details">
        {attempted && blocked && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="error-summary">
            <h2>We could not place your order yet</h2>
            <ul>
              {Object.values(errors).map((m) => (<li key={m}>{m}</li>))}
              {evaluation.blockers.map((m) => (<li key={m}>{m}</li>))}
            </ul>
          </div>
        )}

        <div className="field">
          <label htmlFor="name">Name or nickname</label>
          <input {...inputProps('name')} type="text" autoComplete="off" value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
          <p className="hint">Use a nickname. Nothing is sent anywhere.</p>
          <FieldError field="name" />
        </div>

        <fieldset className="field">
          <legend>Fulfilment</legend>
          {MODES.map((mode) => (
            <label key={mode} className="check">
              <input type="radio" name="mode" value={mode} checked={form.mode === mode} onChange={() => updateForm('mode', mode)} />
              {mode === 'Delivery' ? 'Delivery (PKR 2,500 minimum, PKR 200 fee)' : 'Hub Pickup at H-11 (no minimum, no fee)'}
            </label>
          ))}
        </fieldset>

        <div className="field">
          <label htmlFor="sector">Islamabad sector {form.mode === 'Hub Pickup' && '(optional for pickup)'}</label>
          <select {...inputProps('sector')} value={form.sector} onChange={(e) => updateForm('sector', e.target.value)}>
            <option value="">Choose a sector</option>
            {SECTORS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <FieldError field="sector" />
        </div>

        <fieldset className="field">
          <legend>{form.mode === 'Delivery' ? 'Delivery window' : 'Pickup window'}</legend>
          {WINDOWS.map((w) => (
            <label key={w} className="check">
              <input type="radio" name="window" value={w} checked={form.window === w} onChange={() => updateForm('window', w)} />
              {w}
            </label>
          ))}
          <FieldError field="window" />
        </fieldset>

        <div className="field">
          <label htmlFor="profile">Dietary / spice profile</label>
          <select {...inputProps('profile')} value={form.profile} onChange={(e) => updateForm('profile', e.target.value)}>
            {PROFILES.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
          {form.profile === MILD_PROFILE && (
            <p className={spiceProblem ? 'problem' : 'rule-ok'}>
              <strong>{spiceProblem ? 'Not compatible:' : 'Compatible:'}</strong>{' '}
              {spiceProblem ? `${evaluation.spice.length} High Spice item(s) in your box. Remove them or switch profile.` : 'No High Spice meals in your box.'}
            </p>
          )}
          <FieldError field="profile" />
        </div>

        <div className="field">
          <label htmlFor="note">{form.mode === 'Delivery' ? 'Delivery note or campus gate (optional)' : 'Note (optional)'}</label>
          <textarea {...inputProps('note')} rows={3} value={form.note} onChange={(e) => updateForm('note', e.target.value)} />
          <p className="hint">{form.note.length} / {NOTE_MAX} characters</p>
          <FieldError field="note" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Place simulated order</button>
          <Link to="/meals" className="btn btn-secondary">Back to meals</Link>
        </div>
      </form>

      <aside aria-label="Order summary" className="sticky-aside">
        <OrderSummaryPanel {...panelProps} />
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  useDocumentTitle('Checkout');
  return (
    <>
      <h1>Checkout</h1>
      <p className="lead">Simulated order. No payment is taken and nothing leaves your browser.</p>
      <DataGate><CheckoutForm /></DataGate>
    </>
  );
}
