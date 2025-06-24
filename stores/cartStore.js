import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to ensure price is a valid number, always two decimals
const toPrice = (num) => +parseFloat(num || 0).toFixed(2);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,

      addItem: (product) => {
        const quantity = Math.max(1, product.quantity || 1);
        const id =
          product.id ?? product._id ?? product.productId ?? product.slug;

        const existingItem = get().items.find((item) => item.id === id);

        // Avoid direct get() in each line for performance
        let updatedItems, updatedCount, updatedTotal;

        if (existingItem) {
          updatedItems = get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedItems = [...get().items, { ...product, id, quantity }];
        }

        // Re-calculate count & total for safety (rather than incremental)
        updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        updatedTotal = toPrice(
          updatedItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
        );

        set({ items: updatedItems, count: updatedCount, total: updatedTotal });
      },

      removeItem: (id) => {
        const updatedItems = get().items.filter((i) => i.id !== id);
        const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const updatedTotal = toPrice(
          updatedItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
        );
        set({ items: updatedItems, count: updatedCount, total: updatedTotal });
      },

      updateQuantity: (id, newQuantity) => {
        if (newQuantity <= 0) return get().removeItem(id);

        const updatedItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity: newQuantity } : i
        );
        const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const updatedTotal = toPrice(
          updatedItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
        );
        set({ items: updatedItems, count: updatedCount, total: updatedTotal });
      },

      clearCart: () => set({ items: [], count: 0, total: 0 }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        count: state.count,
        total: state.total,
      }),
      // Optionally, version your store to safely upgrade in future:
      // version: 1,
      // migrate: (persistedState, version) => persistedState,
    }
  )
);
