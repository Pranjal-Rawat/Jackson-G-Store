// stores/cartStore.js
// Route: Internal – Zustand Cart Store (global state for cart items)

import { create } from 'zustand';

// Util: get price as float with 2 decimals
const toPrice = (num) => +parseFloat(num).toFixed(2);

export const useCartStore = create((set) => ({
  items: [],
  count: 0,
  total: 0,

  // Add product to cart (if exists, update quantity)
  addItem: (product) =>
    set((state) => {
      const quantity = product.quantity || 1;
      const id = product.id ?? product._id ?? product.productId ?? product.slug;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        const updatedTotal = state.total + product.price * quantity;
        return {
          items: updatedItems,
          count: state.count + quantity,
          total: toPrice(updatedTotal),
        };
      }
      return {
        items: [...state.items, { ...product, id, quantity }],
        count: state.count + quantity,
        total: toPrice(state.total + product.price * quantity),
      };
    }),

  // Remove product by id
  removeItem: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      const updatedItems = state.items.filter((i) => i.id !== id);
      const updatedCount = state.count - item.quantity;
      const updatedTotal = state.total - item.price * item.quantity;
      return {
        items: updatedItems,
        count: Math.max(0, updatedCount),
        total: toPrice(updatedTotal),
      };
    }),

  // Update quantity of a cart item
  updateQuantity: (id, newQuantity) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      // Remove if newQuantity <= 0
      if (newQuantity <= 0) {
        const updatedItems = state.items.filter((i) => i.id !== id);
        const updatedCount = state.count - item.quantity;
        const updatedTotal = state.total - item.price * item.quantity;
        return {
          items: updatedItems,
          count: Math.max(0, updatedCount),
          total: toPrice(updatedTotal),
        };
      }

      // Update quantity
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
        total: toPrice(updatedTotal),
      };
    }),

  // Empty the cart
  clearCart: () => ({
    items: [],
    count: 0,
    total: 0,
  }),
}));
