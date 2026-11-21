import { Link, NavLink } from 'react-router-dom';
import { useOrder } from '../context/OrderContext.jsx';

export default function Navbar() {
  const { cartCount } = useOrder();
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" aria-label="TiffinLab home">
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="4" y="3" width="24" height="7" rx="3" fill="#f2b134" />
            <rect x="4" y="12" width="24" height="7" rx="3" fill="#fff" />
            <rect x="4" y="21" width="24" height="7" rx="3" fill="#f2b134" />
          </svg>
          <span>TiffinLab</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/meals">Meals</NavLink></li>
            <li>
              <NavLink to="/checkout">
                Checkout <span className="count-pill" aria-label={`${cartCount} items in box`}>{cartCount}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
