// stores/cartStore.js - FIXED VERSION
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  count: 0,
  total: 0,

  addItem: (product) => set((state) => {
    // Extract quantity from product or default to 1
    const quantity = product.quantity || 1;
    
    const existing = state.items.find(item => item.id === product.id);
    if (existing) {
      return {
        // Add the new quantity to the existing quantity
        items: state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ),
        // Update count with the additional quantity
        count: state.count + quantity,
        // Update total price accordingly
        total: +(state.total + (product.price * quantity)).toFixed(2)
      };
    }
    return {
      // For new items, use the quantity from the product object
      items: [...state.items, { ...product, quantity }],
      count: state.count + quantity,
      total: +(state.total + (product.price * quantity)).toFixed(2)
    };
  }),

  removeItem: (id) => set((state) => {
    const item = state.items.find(i => i.id === id);
    return {
      items: state.items.filter(i => i.id !== id),
      count: state.count - item.quantity,
      total: +(state.total - (item.price * item.quantity)).toFixed(2)
    };
  }),

  updateQuantity: (id, newQuantity) => set((state) => {
    if (newQuantity <= 0) {
      const item = state.items.find(i => i.id === id);
      return {
        items: state.items.filter(i => i.id !== id),
        count: state.count - item.quantity,
        total: +(state.total - (item.price * item.quantity)).toFixed(2)
      };
    }
    const items = state.items.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: +items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    };
  }),

  clearCart: () => set({ items: [], count: 0, total: 0 }),
}));