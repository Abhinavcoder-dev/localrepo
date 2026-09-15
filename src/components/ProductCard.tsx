import { Link } from "react-router-dom";
import type { Product } from "../lib/api";
import { useCart } from "../lib/cart";
import { formatMoney } from "../lib/format";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const onSale = product.listPriceCents > product.priceCents;
  const outOfStock = product.stock <= 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-media" aria-label={product.name}>
        <ProductImage hue={product.imageHue} icon={product.imageIcon} seed={product.id} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </Link>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.ratingCount} />
        <div className="product-price-row">
          <span className="product-price">{formatMoney(product.priceCents)}</span>
          {onSale && <span className="product-price-list">{formatMoney(product.listPriceCents)}</span>}
        </div>
        <button
          type="button"
          className="btn btn-dark btn-sm btn-block"
          disabled={outOfStock}
          onClick={() => addItem(product, 1)}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
