import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import clientReducer from "./slices/clientSlice";
import cartReducer from "./slices/cartSlice";

// Configuração centralizada do store Redux
export const store = configureStore({
  reducer: {
    products: productReducer,
    clients: clientReducer,
    cart: cartReducer,
  },
});

// Chaves para localStorage
const STORAGE_KEYS = {
  CART: "cart",
  CLIENTS: "clients",
  PRODUCTS: "products",
};

// Carrega dados persistidos ao inicializar a aplicação
export const loadInitialData = () => {
  try {
    // Carrinho - recupera itens salvos
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      store.dispatch({ type: "cart/setCart", payload: JSON.parse(savedCart) });
    }

    // Clientes - recupera lista salva
    const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (savedClients) {
      store.dispatch({
        type: "clients/setClients",
        payload: JSON.parse(savedClients),
      });
    }

    // Produtos - recupera lista salva
    const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (savedProducts) {
      store.dispatch({
        type: "products/setProducts",
        payload: JSON.parse(savedProducts),
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error);
  }
};

// Persiste automaticamente mudanças de estado no localStorage
store.subscribe(() => {
  const state = store.getState();

  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart.items));
    localStorage.setItem(
      STORAGE_KEYS.CLIENTS,
      JSON.stringify(state.clients.list)
    );
    localStorage.setItem(
      STORAGE_KEYS.PRODUCTS,
      JSON.stringify(state.products.list)
    );
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
  }
});
