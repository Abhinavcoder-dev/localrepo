import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import Icon from "../components/Icon";
import { fetchCategories, fetchProducts, type CategorySummary, type Product } from "../lib/api";

const SHELF_COUNT = 3;

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [shelves, setShelves] = useState<{ category: string; icon: string; items: Product[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const catRes = await fetchCategories();
      if (!active) return;
      const cats = catRes.categories.slice(0, SHELF_COUNT);

      const [featuredRes, ...shelfResults] = await Promise.all([
        fetchProducts({ sort: "rating", page: 1 }),
        ...cats.map((c) => fetchProducts({ category: c.category, page: 1 })),
      ]);
      if (!active) return;

      setFeatured(featuredRes.items.slice(0, 3));
      setShelves(
        cats.map((c: CategorySummary, i: number) => ({
          category: c.category,
          icon: c.icon,
          items: shelfResults[i].items.slice(0, 6),
        })),
      );
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="hero-eyebrow">
              <Icon name="truck" size={16} /> Shipping from every aisle, daily
            </p>
            <h1 className="hero-title">
              PACK IT.
              <br />
              <em>SHIP IT.</em>
              <br />
              LOVE IT.
            </h1>
            <p className="hero-sub">
              191 things worth owning, sorted, priced, and ready for your cart — from cast-iron kettles to
              trail-worthy tents. No membership, no fine print.
            </p>
            <div className="hero-actions">
              <Link to="/search" className="btn btn-primary">
                Shop everything <Icon name="arrow-right" size={16} />
              </Link>
              <Link to="/search?sort=newest" className="btn btn-ghost" style={{ color: "var(--paper)", borderColor: "rgba(246,242,234,0.4)" }}>
                See new arrivals
              </Link>
            </div>
          </div>
          <div className="hero-stack" aria-hidden="true">
            {(featured.length ? featured : Array.from({ length: 3 })).slice(0, 3).map((p, i) => (
              <div className="hero-stack-card" key={p?.id ?? i}>
                <ProductImage hue={p?.imageHue ?? 20 + i * 40} icon={p?.imageIcon ?? "box"} seed={p?.id ?? i} rounded={0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="promo-banner">
        <div className="container promo-banner-inner">
          <span className="promo-item">
            <Icon name="truck" size={18} /> Free shipping over $35
          </span>
          <span className="promo-item">
            <Icon name="shield" size={18} /> Demo checkout, zero risk
          </span>
          <span className="promo-item">
            <Icon name="check" size={18} /> No account, ever
          </span>
        </div>
      </div>

      {!loading && featured.length > 0 && (
        <section className="shelf container">
          <div className="shelf-head">
            <h2 className="shelf-title">Top rated right now</h2>
            <Link to="/search?sort=rating" className="shelf-link">
              See all <Icon name="arrow-right" size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </section>
      )}

      {shelves.map((shelf) => (
        <section className="shelf container" key={shelf.category}>
          <div className="shelf-head">
            <h2 className="shelf-title">
              <Icon name={shelf.icon} size={22} style={{ marginRight: 10, verticalAlign: "-4px" }} />
              {shelf.category}
            </h2>
            <Link to={`/search?category=${encodeURIComponent(shelf.category)}`} className="shelf-link">
              Shop the aisle <Icon name="arrow-right" size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {shelf.items.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
