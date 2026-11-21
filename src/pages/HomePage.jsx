import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useOrder } from '../context/OrderContext.jsx';
import { formatPKR } from '../utils/format.js';

export default function HomePage() {
  useDocumentTitle('Meal prep for Islamabad');
  const { meals, status } = useOrder();
  const featured = meals.filter((m) => ['tl-02', 'tl-08', 'tl-03'].includes(m.id));
  return (
    <>
      <section className="hero">
        <div>
          <h1>Weekday meals, priced and packed before you order.</h1>
          <p className="lead">
            TiffinLab prepares high-protein boxes and weekly bundles for students and professionals in Islamabad.
            See every price, macro and slot limit first. Choose delivery to your sector or collect from the hub.
          </p>
          <Link to="/meals" className="btn btn-primary">Browse all 12 meals</Link>
        </div>
        <svg className="hero-art" viewBox="0 0 200 220" role="img" aria-label="Illustration of a three-tier tiffin carrier">
          <rect x="60" y="8" width="80" height="14" rx="7" fill="#143626" />
          <rect x="40" y="30" width="120" height="46" rx="10" fill="#f2b134" />
          <rect x="40" y="82" width="120" height="46" rx="10" fill="#ffffff" stroke="#1f4d36" strokeWidth="3" />
          <rect x="40" y="134" width="120" height="46" rx="10" fill="#f2b134" />
          <rect x="30" y="186" width="140" height="10" rx="5" fill="#1f4d36" />
        </svg>
      </section>

      <section aria-labelledby="how-heading" className="section">
        <h2 id="how-heading">How an order works</h2>
        <ol className="steps">
          <li><strong>Browse and compare.</strong> Search, filter and compare meals with prices and macros shown.</li>
          <li><strong>Build your box.</strong> Add 1 to 6 of each meal, within the slots left.</li>
          <li><strong>Choose delivery or pickup.</strong> Delivery needs PKR 2,500 of food. Pickup has no minimum.</li>
          <li><strong>Review and confirm.</strong> You see the total and any problems before you place the simulated order.</li>
        </ol>
      </section>

      <section aria-labelledby="rules-heading" className="section">
        <h2 id="rules-heading">Ordering rules, up front</h2>
        <ul className="rule-list">
          <li><strong>Capacity:</strong> 1 to 6 per meal, never more than the batch slots left.</li>
          <li><strong>Mild / Sensitive profile:</strong> cannot include meals marked High Spice.</li>
          <li><strong>Delivery:</strong> PKR 2,500 minimum food subtotal, then a PKR 200 fee. Hub Pickup is free.</li>
        </ul>
      </section>

      {status === 'ready' && featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="section">
          <h2 id="featured-heading">Popular this week</h2>
          <ul className="featured-list">
            {featured.map((m) => (
              <li key={m.id}>
                <Link to={`/meals/${m.id}`}>{m.name}</Link>
                <span>{formatPKR(m.price)} · {m.protein} g protein</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
