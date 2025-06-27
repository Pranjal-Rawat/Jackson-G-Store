// /stores/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ---------- helper ------------------------------------------------------- */
const toPrice = (n) => +parseFloat(String(n ?? 0)).toFixed(2);

/* ---------- store -------------------------------------------------------- */
export const useCartStore = create(
  persist(
    (set, get) => ({
      /* state */
      items: [],   // [{ id, title, price, stock, quantity }]
      count: 0,
      total: 0,

      /* selectors --------------------------------------------------------- */
      getQtyInCart: (id) =>
        get().items.find((i) => i.id === id)?.quantity ?? 0,

      /** --- 🟢 MAIN LOGIC: Virtual Stock Calculation --- */
      getVirtualStock: (id, realStock) => {
        const inCart = get().getQtyInCart(id);
        // Never show less than 0
        return Math.max((realStock ?? 0) - inCart, 0);
      },

      hasReachedStock: (id, stock) =>
        typeof stock === 'number' && get().getQtyInCart(id) >= stock,

      /* actions ----------------------------------------------------------- */
      addItem: async (product, qty = 1) => {
        const id    = product._id ?? product.id ?? product.slug;
        const stock = product.stock ?? Infinity;
        const inCart = get().getQtyInCart(id);
        const canAdd = stock - inCart;

        if (canAdd <= 0) return false; // at limit
        const addQty = Math.min(qty, canAdd);

        const updatedItems = get().items.some((i) => i.id === id)
          ? get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + addQty } : i
            )
          : [...get().items, { ...product, id, quantity: addQty }];

        const updatedCount = updatedItems.reduce((s, i) => s + i.quantity, 0);
        const updatedTotal = toPrice(
          updatedItems.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
        );

        set({ items: updatedItems, count: updatedCount, total: updatedTotal });
        return true;
      },

      removeItem: (id) => {
        const updatedItems = get().items.filter((i) => i.id !== id);
        const updatedCount = updatedItems.reduce((s, i) => s + i.quantity, 0);
        const updatedTotal = toPrice(
          updatedItems.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
        );
        set({ items: updatedItems, count: updatedCount, total: updatedTotal });
      },

      updateQuantity: (id, newQty, stock = Infinity) => {
        if (newQty <= 0) return get().removeItem(id);
        const clamped = Math.min(newQty, stock);

        const updatedItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity: clamped } : i
        );
        const updatedCount = updatedItems.reduce((s, i) => s + i.quantity, 0);
        const updatedTotal = toPrice(
          updatedItems.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
        );
        set({ items: updatedItems, count: updatedCount, total: updatedTotal });
      },

      clearCart: () =>
        set(() => ({ items: [], count: 0, total: 0 })), // functional set
    }),
    {
      name: 'cart-storage',
      partialize: (s) => ({
        items: s.items,
        count: s.count,
        total: s.total,
      }),
    }
  )
);
