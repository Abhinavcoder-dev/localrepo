import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="crate-divider" />
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ marginBottom: 10 }}>
            <span className="brand-mark" aria-hidden="true">
              <Icon name="package" size={20} strokeWidth={1.9} />
            </span>
            <span className="brand-word">
              PALLET<span className="brand-dot">.</span>
            </span>
          </div>
          <p className="footer-tagline">Everything, shipped. A demo storefront — no real orders ship.</p>
        </div>
        <div>
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-list">
            <li>
              <Link to="/search">Browse everything</Link>
            </li>
            <li>
              <Link to="/search?sort=newest">New arrivals</Link>
            </li>
            <li>
              <Link to="/cart">Your cart</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Assurance</h4>
          <ul className="footer-list footer-list-icons">
            <li>
              <Icon name="truck" size={16} /> Flat-rate shipping, free over $35
            </li>
            <li>
              <Icon name="shield" size={16} /> Demo checkout — no real payment
            </li>
            <li>
              <Icon name="check" size={16} /> No account required
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} Pallet Demo Storefront. Not affiliated with any retailer.</div>
    </footer>
  );
}
