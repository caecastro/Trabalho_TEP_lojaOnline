import { createSlice } from "@reduxjs/toolkit";

// Estado inicial para gerenciamento de produtos
const initialState = {
  list: [], // Lista de produtos
  loading: false, // Estado de carregamento
  error: null, // Mensagens de erro
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Define a lista completa de produtos
    setProducts: (state, action) => {
      state.list = action.payload;
    },

    // Adiciona novo produto com dados padronizados
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: `local-${Date.now()}`, // ID único para produtos locais
        rating: {
          rate: 4, // Rating padrão
          count: Math.floor(Math.random() * 500) + 100, // Contagem aleatória
        },
        isLocal: true, // Identificador de produto customizado
      };
      state.list.push(newProduct);
    },

    // Atualiza produto existente por ID
    updateProduct: (state, action) => {
      const { id, data } = action.payload;
      const index = state.list.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },

    // Remove produto da lista
    removeProduct: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },

    // Controla estado de carregamento
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Define mensagem de erro
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Exporta actions para uso em componentes
export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
