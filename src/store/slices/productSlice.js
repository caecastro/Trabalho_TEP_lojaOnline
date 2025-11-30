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
      state.list.push(action.payload);
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
