import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "./Icon";
import { useCart } from "../lib/cart";
import { fetchCategories, type CategorySummary } from "../lib/api";

export default function Header() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  };

  return (
    <header className="site-header">
      <div className="site-header-top">
        <div className="container site-header-row">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Icon name="package" size={22} strokeWidth={1.9} />
            </span>
            <span className="brand-word">
              PALLET<span className="brand-dot">.</span>
            </span>
          </Link>

          <form className="search-form" onSubmit={onSubmit} role="search">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search crates, gear, and everything else…"
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search">
              <Icon name="search" size={19} />
            </button>
          </form>

          <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <Icon name="cart" size={24} strokeWidth={1.6} />
            {count > 0 && <span className="cart-count">{count > 99 ? "99+" : count}</span>}
            <span className="cart-word">Cart</span>
          </Link>
        </div>
      </div>
      <nav className="site-header-nav" aria-label="Categories">
        <div className="container category-scroll">
          <Link to="/search" className="category-chip category-chip-all">
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.category} to={`/search?category=${encodeURIComponent(c.category)}`} className="category-chip">
              <Icon name={c.icon} size={15} strokeWidth={1.6} />
              {c.category}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
