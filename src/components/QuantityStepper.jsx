// Controlled by parent state. Rule 1 text sits beside the control; "+" disables at the limit.
export default function QuantityStepper({ meal, quantity, onIncrement, onDecrement, onRemove, showLimit = true }) {
  const max = Math.max(0, Math.min(6, meal.remainingSlots));
  const atLimit = quantity >= max;
  return (
    <div className="stepper-wrap">
      <div className="stepper" role="group" aria-label={`Quantity of ${meal.name}`}>
        <button type="button" className="btn btn-secondary btn-icon" onClick={() => onDecrement(meal.id)} aria-label={`Remove one ${meal.name}`}>
          −
        </button>
        <output aria-live="polite" aria-label={`${quantity} in box`}>{quantity}</output>
        <button type="button" className="btn btn-secondary btn-icon" onClick={() => onIncrement(meal.id)} disabled={atLimit} aria-label={`Add one ${meal.name}`}>
          +
        </button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => onRemove(meal.id)} aria-label={`Remove ${meal.name} from box`}>
          Remove
        </button>
      </div>
      {showLimit && (
        <p className="hint">{atLimit ? `Limit reached: max ${max} per order.` : `Max ${max} per order.`}</p>
      )}
    </div>
  );
}
