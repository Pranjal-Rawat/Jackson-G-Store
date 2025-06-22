import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const toPrice = (num) => +parseFloat(num).toFixed(2);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,

      addItem: (product) => {
        const quantity = Math.max(1, product.quantity || 1);
        const id = product.id ?? product._id ?? product.productId ?? product.slug;
        const existingItem = get().items.find((item) => item.id === id);

        if (existingItem) {
          const updatedItems = get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return set({
            items: updatedItems,
            count: get().count + quantity,
            total: toPrice(get().total + product.price * quantity),
          });
        }
        return set({
          items: [...get().items, { ...product, id, quantity }],
          count: get().count + quantity,
          total: toPrice(get().total + product.price * quantity),
        });
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        const updatedItems = get().items.filter((i) => i.id !== id);
        return set({
          items: updatedItems,
          count: Math.max(0, get().count - item.quantity),
          total: toPrice(get().total - (item.price * item.quantity)),
        });
      },

      updateQuantity: (id, newQuantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        if (newQuantity <= 0) {
          const updatedItems = get().items.filter((i) => i.id !== id);
          return set({
            items: updatedItems,
            count: Math.max(0, get().count - item.quantity),
            total: toPrice(get().total - (item.price * item.quantity)),
          });
        }

        const updatedItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity: newQuantity } : i
        );
        const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const updatedTotal = updatedItems.reduce(
          (sum, i) => sum + (i.price * i.quantity), 0
        );
        return set({
          items: updatedItems,
          count: updatedCount,
          total: toPrice(updatedTotal),
        });
      },

      clearCart: () =>
        set({
          items: [],
          count: 0,
          total: 0,
        }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        count: state.count,
        total: state.total,
      }),
    }
  )
);

// Optionally add selector helpers here!
