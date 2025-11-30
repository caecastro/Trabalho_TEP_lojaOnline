import { createSlice } from "@reduxjs/toolkit";

// Estado inicial do carrinho
const initialState = {
  items: [], // Array de itens no carrinho
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Adiciona item ao carrinho ou incrementa quantidade se já existir
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // Remove item do carrinho por ID
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Atualiza quantidade de item específico (mínimo 1)
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity); // Garante quantidade mínima de 1
      }
    },

    // Esvazia todo o carrinho
    clearCart: (state) => {
      state.items = [];
    },

    // Substitui todo o carrinho (útil para carregar estado salvo)
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
