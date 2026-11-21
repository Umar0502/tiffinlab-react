import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format.js';
import { quantityLimitLabel } from '../rules/orderRules.js';
import QuantityStepper from './QuantityStepper.jsx';

export function MealImage({ meal }) {
  const [failed, setFailed] = useState(false);
  if (failed || !meal.image) return <div className="img-fallback">Image unavailable</div>;
  return <img src={meal.image} alt={`Illustration of ${meal.name}`} loading="lazy" onError={() => setFailed(true)} />;
}

export default function MealCard({
  meal, quantity, onAdd, onIncrement, onDecrement, onRemove,
  compareChecked, compareDisabled, onToggleCompare,
}) {
  const soldOut = meal.remainingSlots < 1;
  return (
    <article className={`card meal-card${quantity > 0 ? ' is-selected' : ''}`}>
      <Link to={`/meals/${meal.id}`} className="card-image" tabIndex={-1} aria-hidden="true">
        <MealImage meal={meal} />
      </Link>
      <div className="card-body">
        <div className="badge-row">
          <span className="badge">{meal.category}</span>
          {meal.highSpice && <span className="badge badge-spice">High Spice</span>}
          {soldOut && <span className="badge badge-out">Sold out</span>}
          {quantity > 0 && <span className="badge badge-selected">In your box: {quantity}</span>}
        </div>
        <h3 className="card-title"><Link to={`/meals/${meal.id}`}>{meal.name}</Link></h3>
        <p className="card-desc">{meal.description}</p>
        <p className="macros">{meal.calories} kcal · {meal.protein} g protein</p>
        <p className="price">{formatPKR(meal.price)}</p>
        <p className="hint">{quantityLimitLabel(meal.remainingSlots)}</p>
        <div className="card-actions">
          {quantity > 0 ? (
            <QuantityStepper meal={meal} quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} onRemove={onRemove} showLimit={false} />
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => onAdd(meal.id)} disabled={soldOut}>
              {soldOut ? 'Unavailable' : 'Add to box'}
            </button>
          )}
          {onToggleCompare && (
            <label className="check">
              <input type="checkbox" checked={compareChecked} disabled={compareDisabled && !compareChecked} onChange={() => onToggleCompare(meal.id)} />
              Compare
            </label>
          )}
        </div>
      </div>
    </article>
  );
}
