export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  priceCents: number;
  listPriceCents: number;
  rating: string;
  ratingCount: number;
  stock: number;
  badge: string | null;
  imageHue: number;
  imageIcon: string;
  createdAt: string | null;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CategorySummary {
  category: string;
  count: number;
  icon: string;
}

export interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zip: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  status: string;
  createdAt: string | null;
}

export interface OrderItemRecord {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  unitPriceCents: number;
  quantity: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function fetchProducts(params: {
  q?: string;
  category?: string;
  minRating?: number;
  sort?: string;
  page?: number;
}): Promise<ProductListResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.minRating) search.set("minRating", String(params.minRating));
  if (params.sort) search.set("sort", params.sort);
  if (params.page) search.set("page", String(params.page));
  return request(`/api/products?${search.toString()}`);
}

export function fetchProduct(slug: string): Promise<{ product: Product; related: Product[] }> {
  return request(`/api/products/${slug}`);
}

export function fetchCategories(): Promise<{ categories: CategorySummary[] }> {
  return request(`/api/categories`);
}

export interface CheckoutPayload {
  items: { productId: number; quantity: number }[];
  customer: {
    name: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export function submitCheckout(payload: CheckoutPayload): Promise<{ orderNumber: string }> {
  return request(`/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchOrder(orderNumber: string): Promise<{ order: OrderRecord; items: OrderItemRecord[] }> {
  return request(`/api/orders/${orderNumber}`);
}
