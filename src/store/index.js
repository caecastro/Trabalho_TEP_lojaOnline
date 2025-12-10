import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import clientReducer from "./slices/clientSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    clients: clientReducer,
    cart: cartReducer,
  },
});

const STORAGE_KEYS = {
  CART: "cart",
  CLIENTS: "clients",
  PRODUCTS: "products",
  EDITED_API_PRODUCTS: "editedApiProducts",
  DELETED_API_PRODUCTS: "deletedApiProducts",
};

export const loadInitialData = () => {
  try {
    // Carrinho
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      store.dispatch({ type: "cart/setCart", payload: JSON.parse(savedCart) });
    }

    // Clientes
    const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (savedClients) {
      store.dispatch({
        type: "clients/setClients",
        payload: JSON.parse(savedClients),
      });
    }

    // Produtos locais
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

store.subscribe(() => {
  const state = store.getState();

  try {
    // Salva estados principais
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart.items));
    localStorage.setItem(
      STORAGE_KEYS.CLIENTS,
      JSON.stringify(state.clients.list)
    );
    localStorage.setItem(
      STORAGE_KEYS.PRODUCTS,
      JSON.stringify(state.products.list)
    );

    // Atualiza automaticamente o carrinho quando produtos são excluídos
    const deletedProducts = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DELETED_API_PRODUCTS) || "[]"
    );

    const editedProducts = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.EDITED_API_PRODUCTS) || "{}"
    );

    if (deletedProducts.length > 0) {
      const currentCart = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CART) || "[]"
      );

      // Filtra produtos excluídos e produtos editados que foram excluídos
      const filteredCart = currentCart.filter((item) => {
        // Verifica se o produto foi excluído
        const isDeleted =
          deletedProducts.includes(item.id) ||
          deletedProducts.includes(item.originalApiId);

        // Verifica se é um produto editado que foi excluído
        const isEditedAndDeleted =
          item.isEditedApiProduct &&
          editedProducts[item.originalApiId] === undefined;

        return !isDeleted && !isEditedAndDeleted;
      });

      // Atualiza se houver mudanças
      if (filteredCart.length !== currentCart.length) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filteredCart));
        store.dispatch({ type: "cart/setCart", payload: filteredCart });
      }
    }
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
  }
});
