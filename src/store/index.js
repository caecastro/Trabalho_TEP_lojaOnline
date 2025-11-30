import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice.js";
import clientReducer from "./slices/clientSlice.js";
import cartReducer from "./slices/cartSlice.js";

export const store = configureStore({
  reducer: {
    products: productReducer,
    clients: clientReducer,
    cart: cartReducer,
  },
});

// Carregar dados do localStorage ao inicializar
export const loadInitialData = () => {
  try {
    // Carrinho
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      store.dispatch({ type: "cart/setCart", payload: cartItems });
    }

    // Clients
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      store.dispatch({ type: "clients/setClients", payload: clients });
    }

    // PRODUTOS - ADICIONADO
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      store.dispatch({ type: "products/setProducts", payload: products });
    }
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
  }
};

// Salvar dados no localStorage sempre que mudarem
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem("cart", JSON.stringify(state.cart.items));
    localStorage.setItem("clients", JSON.stringify(state.clients.list));
    localStorage.setItem("products", JSON.stringify(state.products.list)); // ADICIONADO
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
});
