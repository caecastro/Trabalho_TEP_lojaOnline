// src/store/slices/clientsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addClient: (state, action) => {
      state.list.push(action.payload);
    },
    removeClient: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },
    updateClient: (state, action) => {
      const { id, data } = action.payload;
      const index = state.list.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },
    setClients: (state, action) => {
      state.list = action.payload;
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
  addClient,
  removeClient,
  updateClient,
  setClients,
  setLoading,
  setError,
} = clientsSlice.actions;

export default clientsSlice.reducer;
