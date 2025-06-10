// stores/cartStore.js
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  count: 0,
  total: 0,

  addItem: (product) =>
    set((state) => {
      const quantity = product.quantity || 1;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );

        const updatedTotal = state.total + product.price * quantity;

        return {
          items: updatedItems,
          count: state.count + quantity,
          total: +updatedTotal.toFixed(2),
        };
      }

      return {
        items: [...state.items, { ...product, quantity }],
        count: state.count + quantity,
        total: +(state.total + product.price * quantity).toFixed(2),
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      const updatedItems = state.items.filter((i) => i.id !== id);
      const updatedCount = state.count - item.quantity;
      const updatedTotal = state.total - item.price * item.quantity;

      return {
        items: updatedItems,
        count: updatedCount,
        total: +updatedTotal.toFixed(2),
      };
    }),

  updateQuantity: (id, newQuantity) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      if (newQuantity <= 0) {
        return {
          items: state.items.filter((i) => i.id !== id),
          count: state.count - item.quantity,
          total: +(state.total - item.price * item.quantity).toFixed(2),
        };
      }

      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );

      const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const updatedTotal = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      return {
        items: updatedItems,
        count: updatedCount,
        total: +updatedTotal.toFixed(2),
      };
    }),

  clearCart: () => ({
    items: [],
    count: 0,
    total: 0,
  }),
}));
