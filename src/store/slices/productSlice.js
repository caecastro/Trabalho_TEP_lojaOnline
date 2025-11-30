import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    },
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: `local-${Date.now()}`,
        rating: {
          rate: 4,
          count: Math.floor(Math.random() * 500) + 100,
        },
        isLocal: true, // Marcar produtos locais
      };
      state.list.push(newProduct);
    },
    updateProduct: (state, action) => {
      const { id, data } = action.payload;
      const index = state.list.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },
    removeProduct: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
