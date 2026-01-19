import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as productsService from '../lib/productsService';

export interface Product {
  id: string;
  images: string[]; // Changed from single image to array of images
  title: string;
  category: string;
  price: string;
  description?: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks for Firebase products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productsService.getAllProducts();
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData: Omit<Product, 'id'>, { rejectWithValue }) => {
    try {
      const product = await productsService.addProduct(productData);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product, { rejectWithValue }) => {
    try {
      const { id, ...productData } = product;
      await productsService.updateProduct(id, productData);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productsService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add product
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;