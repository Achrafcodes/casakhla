import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from './productsSlice';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; size?: string }>) => {
      const { product, size } = action.payload;
      const existingItem = state.items.find(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          selectedSize: size,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size?: string }>) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        item => !(item.id === id && item.selectedSize === size)
      );
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size?: string; quantity: number }>) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.selectedSize === size
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
