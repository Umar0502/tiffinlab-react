import StatusBanner from './StatusBanner.jsx';
import { useOrder } from '../context/OrderContext.jsx';

// Renders loading / error states; calls children only when the catalogue is ready (FR14).
export default function DataGate({ children }) {
  const { status, errorMessage, retryLoad } = useOrder();
  if (status === 'loading') {
    return (
      <div aria-busy="true" aria-live="polite">
        <p className="loading-text">Loading meals…</p>
        <div className="meal-grid" aria-hidden="true">
          {[1, 2, 3].map((n) => (<div key={n} className="card skeleton" />))}
        </div>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <StatusBanner
        tone="error"
        title="We could not load the menu"
        action={<button type="button" className="btn btn-primary btn-small" onClick={retryLoad}>Retry</button>}
      >
        <p>{errorMessage} Your box is saved. Turn off the demo failure control, then press Retry.</p>
      </StatusBanner>
    );
  }
  return children;
}
