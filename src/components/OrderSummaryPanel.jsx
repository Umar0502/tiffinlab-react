import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format.js';
import { MILD_PROFILE, MIN_DELIVERY_SUBTOTAL, DELIVERY_FEE } from '../rules/orderRules.js';
import QuantityStepper from './QuantityStepper.jsx';

// Persistent summary: items, fees, minimums and rule problems in one place (Decision 2).
export default function OrderSummaryPanel({
  lines, evaluation, profile, onIncrement, onDecrement, onRemove, onSwitchProfile, onSwitchToPickup,
  showCheckoutLink = false, children,
}) {
  const { totals, availability, spice, fulfilment } = evaluation;
  const availabilityById = Object.fromEntries(availability.map((c) => [c.mealId, c]));
  const spiceIds = new Set(spice.map((c) => c.mealId));
  const delivery = totals.mode === 'Delivery';

  return (
    <section className="panel" aria-labelledby="box-heading">
      <h2 id="box-heading">Your box</h2>
      <p className="hint">Simulated order. No real payment.</p>
      {lines.length === 0 ? (
        <p className="empty-note">Your box is empty. <Link to="/meals">Browse meals</Link> to start.</p>
      ) : (
        <ul className="line-list">
          {lines.map(({ meal, quantity }) => (
            <li key={meal.id} className={availabilityById[meal.id] || spiceIds.has(meal.id) ? 'line has-problem' : 'line'}>
              <div className="line-head">
                <Link to={`/meals/${meal.id}`}>{meal.name}</Link>
                <span>{formatPKR(meal.price * quantity)}</span>
              </div>
              {meal.highSpice && <span className="badge badge-spice">High Spice</span>}
              <QuantityStepper meal={meal} quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} onRemove={onRemove} />
              {availabilityById[meal.id] && (
                <p className="problem"><strong>Over limit:</strong> {availabilityById[meal.id].message}</p>
              )}
              {spiceIds.has(meal.id) && (
                <p className="problem">
                  <strong>Not compatible:</strong> High Spice with the {MILD_PROFILE} profile.{' '}
                  <button type="button" className="link-button" onClick={() => onRemove(meal.id)}>Remove item</button>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {spice.length > 0 && (
        <p className="problem">
          <button type="button" className="btn btn-secondary btn-small" onClick={onSwitchProfile}>Switch to Standard profile</button>
        </p>
      )}

      <dl className="totals">
        <div><dt>Items</dt><dd>{totals.itemCount}</dd></div>
        <div><dt>Food subtotal</dt><dd>{formatPKR(totals.subtotal)}</dd></div>
        <div>
          <dt>Delivery fee</dt>
          <dd>{delivery && !fulfilment.valid ? `${formatPKR(0)} (${formatPKR(DELIVERY_FEE)} applies at ${formatPKR(MIN_DELIVERY_SUBTOTAL)})` : formatPKR(totals.deliveryFee)}</dd>
        </div>
        <div className="grand"><dt>Total</dt><dd>{formatPKR(totals.total)}</dd></div>
      </dl>

      {lines.length > 0 && (
        <p className={fulfilment.valid ? 'rule-ok' : 'problem'}>
          <strong>{fulfilment.valid ? 'Fulfilment OK:' : 'Minimum not met:'}</strong> {fulfilment.message}{' '}
          {!fulfilment.valid && delivery && (
            <button type="button" className="link-button" onClick={onSwitchToPickup}>Switch to Hub Pickup</button>
          )}
        </p>
      )}
      {children}
      {showCheckoutLink && lines.length > 0 && (
        <Link to="/checkout" className="btn btn-primary btn-block">Go to checkout</Link>
      )}
    </section>
  );
}
