import { Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useOrder } from '../context/OrderContext.jsx';
import { formatPKR } from '../utils/format.js';

export default function ConfirmationPage() {
  useDocumentTitle('Order confirmed');
  const { lastOrder, startNewOrder } = useOrder();
  const navigate = useNavigate();

  if (!lastOrder) {
    return (
      <div className="empty-state">
        <h1>No recent order</h1>
        <p>Place an order from checkout and your simulated receipt will appear here.</p>
        <Link to="/meals" className="btn btn-primary">Browse meals</Link>
      </div>
    );
  }
  const { id, items, totals, details, placedAt } = lastOrder;
  return (
    <article className="receipt">
      <p className="badge badge-selected">Success: simulated order placed</p>
      <h1>Thanks, {details.name}. Your box is booked.</h1>
      <p className="lead">Receipt ID <strong>{id}</strong>. This is a simulation: no food will be made and no money was taken.</p>

      <section aria-labelledby="items-heading">
        <h2 id="items-heading">Items</h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th scope="col">Meal</th><th scope="col">Qty</th><th scope="col">Line total</th></tr></thead>
            <tbody>
              {items.map((i) => (<tr key={i.id}><th scope="row">{i.name}</th><td>{i.quantity}</td><td>{formatPKR(i.unitPrice * i.quantity)}</td></tr>))}
            </tbody>
          </table>
        </div>
        <dl className="totals">
          <div><dt>Items</dt><dd>{totals.itemCount}</dd></div>
          <div><dt>Food subtotal</dt><dd>{formatPKR(totals.subtotal)}</dd></div>
          <div><dt>Delivery fee</dt><dd>{formatPKR(totals.deliveryFee)}</dd></div>
          <div className="grand"><dt>Total</dt><dd>{formatPKR(totals.total)}</dd></div>
        </dl>
      </section>

      <section aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Schedule</h2>
        <dl className="facts">
          <div><dt>Method</dt><dd>{details.mode}</dd></div>
          <div><dt>Window</dt><dd>{details.window}</dd></div>
          <div><dt>{details.mode === 'Delivery' ? 'Sector' : 'Pickup'}</dt><dd>{details.mode === 'Delivery' ? details.sector : 'H-11 Hub'}</dd></div>
          <div><dt>Profile</dt><dd>{details.profile}</dd></div>
        </dl>
        {details.note && <p><strong>Your note:</strong> {details.note}</p>}
        <p className="hint">Placed {new Date(placedAt).toLocaleString('en-GB')}.</p>
      </section>

      <button type="button" className="btn btn-primary" onClick={() => { startNewOrder(); navigate('/meals'); }}>
        Start a new order
      </button>
    </article>
  );
}
