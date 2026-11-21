// tone: 'info' | 'warning' | 'error' | 'success'. Each tone has a text label, not colour alone.
const LABELS = { info: 'Note', warning: 'Warning', error: 'Error', success: 'Success' };

export default function StatusBanner({ tone = 'info', title, children, action }) {
  return (
    <div className={`banner banner-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div className="banner-text">
        <p className="banner-title">
          <span className="banner-label">{LABELS[tone]}:</span> {title}
        </p>
        {children && <div className="banner-body">{children}</div>}
      </div>
      {action}
    </div>
  );
}
