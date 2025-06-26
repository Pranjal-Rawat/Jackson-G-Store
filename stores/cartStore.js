// /stores/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- helpers ---------------------------------------------------------------
const toPrice = (n) => +parseFloat(String(n ?? 0)).toFixed(2);

// --- store -----------------------------------------------------------------
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],          // [{ id, title, price, stock, quantity }]
      count: 0,
      total: 0,

      // Qty already in cart for given id
      getQtyInCart: (id) =>
        get().items.find((i) => i.id === id)?.quantity ?? 0,

      // Have we reached (or exceeded) this item’s stock limit?
      hasReachedStock: (id, stock) =>
        typeof stock === 'number' && get().getQtyInCart(id) >= stock,

      // Add up to available stock.  Returns true if anything was added.
      addItem: async (product, qty = 1) => {
        const id    = product.id ?? product._id ?? product.productId ?? product.slug;
        const stock = product.stock ?? Infinity;
        const inCart = get().getQtyInCart(id);
        const canAdd = stock - inCart;

        if (canAdd <= 0) return false;                 // already at limit
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

      clearCart: () => set({ items: [], count: 0, total: 0 }),
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
