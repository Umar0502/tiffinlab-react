import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import DemoControlsBar from './components/DemoControlsBar.jsx';
import ConflictBanner from './components/ConflictBanner.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import MealDetailsPage from './pages/MealDetailsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// On route change: scroll to top and move focus to <main> (skipped on first load).
function RouteFocus({ mainRef }) {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, mainRef]);
  return null;
}

export default function App() {
  const mainRef = useRef(null);
  return (
    <OrderProvider>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Navbar />
      <DemoControlsBar />
      <ConflictBanner />
      <RouteFocus mainRef={mainRef} />
      <main id="main" ref={mainRef} tabIndex={-1} className="container main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meals" element={<CatalogPage />} />
          <Route path="/meals/:id" element={<MealDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </OrderProvider>
  );
}
