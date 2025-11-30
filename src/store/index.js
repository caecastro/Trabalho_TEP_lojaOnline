// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/clientSlice.js"; // ✅ corrigido para singular

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
  },
});
