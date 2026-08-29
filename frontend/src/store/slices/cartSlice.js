import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : { street: '', city: '', state: '', postalCode: '', country: 'India' };

// Helper to compute subtotal and totals
const updateCartTotals = (state) => {
  state.itemsPrice = Math.round(
    state.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0) * 100
  ) / 100;

  // Free shipping over ₹999, else ₹99
  state.shippingPrice = state.itemsPrice > 999 || state.itemsPrice === 0 ? 0 : 99;
  // 5% GST
  state.taxPrice = Math.round(state.itemsPrice * 0.05 * 100) / 100;
  // Total
  state.totalPrice = Math.round((state.itemsPrice + state.shippingPrice + state.taxPrice) * 100) / 100;

  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
};

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

// Initial calculations
updateCartTotals(initialState);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Cap quantity at available stock
        const newQty = (existItem.quantity || 1) + (item.quantity || 1);
        existItem.quantity = Math.min(newQty, item.stock || newQty);
      } else {
        state.cartItems.push(item);
      }
      updateCartTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((x) => x._id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock || 99));
      }
      updateCartTotals(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCartTotals(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cartItems = [];
      updateCartTotals(state);
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, saveShippingAddress, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
