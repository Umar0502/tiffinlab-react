import { useOrder } from '../context/OrderContext.jsx';

// Evaluator controls for edge cases (loading failure, changed availability, empty dataset).
export default function DemoControlsBar() {
  const { demo, setDemoFlag, slotDropActive, toggleSlotDrop, cart } = useOrder();
  const activeCount = Number(demo.failLoad) + Number(demo.emptyCatalog) + Number(slotDropActive);
  return (
    <aside className="demo-bar" aria-label="Assignment demo controls">
      <div className="container">
        <details>
          <summary>
            Assignment demo controls (simulation only){activeCount > 0 ? ` - ${activeCount} active` : ''}
          </summary>
          <div className="demo-grid">
            <label className="check">
              <input
                type="checkbox"
                checked={demo.failLoad}
                onChange={(e) => setDemoFlag('failLoad', e.target.checked)}
              />
              Simulate data load error
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={demo.emptyCatalog}
                onChange={(e) => setDemoFlag('emptyCatalog', e.target.checked)}
              />
              Simulate empty catalogue
            </label>
            <div>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={toggleSlotDrop}
                aria-pressed={slotDropActive}
                disabled={!slotDropActive && cart.length === 0}
              >
                {slotDropActive ? 'Restore slots' : 'Simulate slot drop'}
              </button>
              <p className="hint">
                {slotDropActive
                  ? 'Slots on your selected meals are reduced by 1.'
                  : cart.length === 0
                    ? 'Add a meal to your box first.'
                    : 'Reduces slots on meals in your box so the conflict recovery can be tested.'}
              </p>
            </div>
          </div>
        </details>
      </div>
    </aside>
  );
}
