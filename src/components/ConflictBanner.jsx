import { useOrder } from '../context/OrderContext.jsx';
import StatusBanner from './StatusBanner.jsx';

// Shown on every page when the saved/current selection no longer matches availability.
export default function ConflictBanner() {
  const { evaluation, missingItems, fixQuantities } = useOrder();
  const count = evaluation.availability.length + missingItems.length;
  if (count === 0) return null;
  return (
    <div className="container banner-wrap">
      <StatusBanner
        tone="warning"
        title={`${count} item${count === 1 ? '' : 's'} in your box no longer match availability`}
        action={
          <button type="button" className="btn btn-primary btn-small" onClick={fixQuantities}>
            Adjust my box
          </button>
        }
      >
        <ul>
          {evaluation.availability.map((c) => (<li key={c.mealId}>{c.message}</li>))}
          {missingItems.map((m) => (<li key={m.id}>A saved item ({m.id}) is no longer on the menu.</li>))}
        </ul>
        <p>Adjust lowers quantities to what is available and removes sold-out items.</p>
      </StatusBanner>
    </div>
  );
}
