import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="empty-state">
      <h1>That page does not exist</h1>
      <p>The address may be mistyped or out of date. Start from the menu instead.</p>
      <Link to="/meals" className="btn btn-primary">Browse meals</Link>
    </div>
  );
}
