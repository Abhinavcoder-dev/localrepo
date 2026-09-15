import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./api";

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  listPriceCents: number;
  imageHue: number;
  imageIcon: string;
  stock: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "pallet_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      const cap = Math.max(1, product.stock);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: Math.min(cap, i.quantity + quantity) } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          priceCents: product.priceCents,
          listPriceCents: product.listPriceCents,
          imageHue: product.imageHue,
          imageIcon: product.imageIcon,
          stock: product.stock,
          quantity: Math.min(cap, quantity),
        },
      ];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const setQuantity = (productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i)),
    );
  };

  const clear = () => setItems([]);

  const { count, subtotalCents } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        count: acc.count + item.quantity,
        subtotalCents: acc.subtotalCents + item.priceCents * item.quantity,
      }),
      { count: 0, subtotalCents: 0 },
    );
  }, [items]);

  return (
    <CartContext.Provider value={{ items, count, subtotalCents, addItem, removeItem, setQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
