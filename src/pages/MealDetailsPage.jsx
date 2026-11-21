import { Link, useParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useOrder, usePanelProps } from '../context/OrderContext.jsx';
import { formatPKR } from '../utils/format.js';
import { quantityLimitLabel, MIN_DELIVERY_SUBTOTAL, DELIVERY_FEE } from '../rules/orderRules.js';
import DataGate from '../components/DataGate.jsx';
import { MealImage } from '../components/MealCard.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import OrderSummaryPanel from '../components/OrderSummaryPanel.jsx';

function Details() {
  const { id } = useParams();
  const { mealsById, cart, increment, decrement, removeItem } = useOrder();
  const panelProps = usePanelProps();
  const meal = mealsById[id];
  useDocumentTitle(meal ? meal.name : 'Meal not found');

  if (!meal) {
    return (
      <div className="empty-state">
        <h1>We could not find that meal</h1>
        <p>There is no meal with the ID “{id}”. It may have been removed, or the link may be mistyped.</p>
        <Link to="/meals" className="btn btn-primary">Back to all meals</Link>
      </div>
    );
  }
  const quantity = cart.find((i) => i.id === meal.id)?.quantity ?? 0;
  const soldOut = meal.remainingSlots < 1;

  return (
    <div className="layout-two">
      <article>
        <p><Link to="/meals">← All meals</Link></p>
        <div className="detail-image"><MealImage meal={meal} /></div>
        <div className="badge-row">
          <span className="badge">{meal.category}</span>
          {meal.tags.map((t) => (<span key={t} className="badge">{t}</span>))}
          {meal.highSpice ? <span className="badge badge-spice">High Spice</span> : <span className="badge">Not High Spice</span>}
        </div>
        <h1>{meal.name}</h1>
        <p className="lead">{meal.description}</p>
        <p className="price price-large">{formatPKR(meal.price)}</p>

        <section aria-labelledby="nutrition-heading">
          <h2 id="nutrition-heading">Nutrition per box</h2>
          <dl className="facts">
            <div><dt>Calories</dt><dd>{meal.calories} kcal</dd></div>
            <div><dt>Protein</dt><dd>{meal.protein} g</dd></div>
            <div><dt>Carbs</dt><dd>{meal.carbs} g</dd></div>
            <div><dt>Fat</dt><dd>{meal.fat} g</dd></div>
          </dl>
          <p><strong>Ingredients:</strong> {meal.ingredients.join(', ')}.</p>
          <p><strong>Prep note:</strong> {meal.prepNote}</p>
        </section>

        <section aria-labelledby="rules-heading" className="notice">
          <h2 id="rules-heading">Ordering rules for this meal</h2>
          <ul>
            <li><strong>Capacity:</strong> {quantityLimitLabel(meal.remainingSlots)}.</li>
            <li><strong>Spice:</strong> {meal.highSpice ? 'High Spice. Not allowed with the Mild / Sensitive profile.' : 'Safe for the Mild / Sensitive profile.'}</li>
            <li><strong>Delivery:</strong> {formatPKR(MIN_DELIVERY_SUBTOTAL)} minimum food subtotal, then a {formatPKR(DELIVERY_FEE)} fee. Hub Pickup has no minimum.</li>
          </ul>
        </section>

        <div className="detail-action">
          {quantity > 0 ? (
            <QuantityStepper meal={meal} quantity={quantity} onIncrement={increment} onDecrement={decrement} onRemove={removeItem} />
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => increment(meal.id)} disabled={soldOut}>
              {soldOut ? 'Sold out for this batch' : 'Add to box'}
            </button>
          )}
        </div>
      </article>
      <aside aria-label="Order summary" className="sticky-aside">
        <OrderSummaryPanel {...panelProps} showCheckoutLink />
      </aside>
    </div>
  );
}

export default function MealDetailsPage() {
  return <DataGate><Details /></DataGate>;
}
