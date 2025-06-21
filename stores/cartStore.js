// stores/cartStore.js
// Global Zustand Cart Store for Jackson Grocery Store

import { create } from 'zustand';

// Utility: Standardize price to two decimals
const toPrice = (num) => +parseFloat(num).toFixed(2);

export const useCartStore = create((set, get) => ({
  items: [],
  count: 0,
  total: 0,

  // Add item to cart (increments if exists)
  addItem: (product) =>
    set((state) => {
      const quantity = Math.max(1, product.quantity || 1);
      const id = product.id ?? product._id ?? product.productId ?? product.slug;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Update quantity for existing
        const updatedItems = state.items.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return {
          items: updatedItems,
          count: state.count + quantity,
          total: toPrice(state.total + (product.price * quantity)),
        };
      }
      // Add new
      return {
        items: [...state.items, { ...product, id, quantity }],
        count: state.count + quantity,
        total: toPrice(state.total + (product.price * quantity)),
      };
    }),

  // Remove by id
  removeItem: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;
      const updatedItems = state.items.filter((i) => i.id !== id);
      return {
        items: updatedItems,
        count: Math.max(0, state.count - item.quantity),
        total: toPrice(state.total - (item.price * item.quantity)),
      };
    }),

  // Update item quantity
  updateQuantity: (id, newQuantity) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      // Remove if <= 0
      if (newQuantity <= 0) {
        const updatedItems = state.items.filter((i) => i.id !== id);
        return {
          items: updatedItems,
          count: Math.max(0, state.count - item.quantity),
          total: toPrice(state.total - (item.price * item.quantity)),
        };
      }

      // Update quantity
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
      const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const updatedTotal = updatedItems.reduce(
        (sum, i) => sum + (i.price * i.quantity), 0
      );
      return {
        items: updatedItems,
        count: updatedCount,
        total: toPrice(updatedTotal),
      };
    }),

  // Clear cart
  clearCart: () => ({
    items: [],
    count: 0,
    total: 0,
  }),
}));
