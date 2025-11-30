import { createSlice } from "@reduxjs/toolkit";

// Gera data aleatória nos últimos 5 anos para novos clientes
const generateRandomDate = () => {
  const current = new Date();
  const fiveYearsAgo = new Date(
    current.getFullYear() - 5,
    current.getMonth(),
    current.getDate()
  );

  const randomTime =
    fiveYearsAgo.getTime() +
    Math.random() * (current.getTime() - fiveYearsAgo.getTime());
  return new Date(randomTime).toISOString().split("T")[0]; // Retorna apenas a data (YYYY-MM-DD)
};

// Estado inicial com cliente de exemplo
const initialState = {
  list: [
    {
      id: "1",
      firstName: "Leanne",
      lastName: "Graham",
      email: "Sincere@april.biz",
      contactAt: generateRandomDate(),
      address: "New street, 2505 - Chicago",
      phone: "1-555-264-2033",
      status: "activated",
    },
  ],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    // Substitui toda a lista de clientes
    setClients: (state, action) => {
      state.list = action.payload;
    },

    // Adiciona novo cliente com data de contato gerada automaticamente
    addClient: (state, action) => {
      const newClient = {
        ...action.payload,
        contactAt: generateRandomDate(),
      };
      state.list.push(newClient);
    },

    // Remove cliente por ID
    removeClient: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },

    // Atualiza dados de cliente específico
    updateClient: (state, action) => {
      const { id, data } = action.payload;
      const index = state.list.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
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

export const {
  addClient,
  removeClient,
  updateClient,
  setClients,
  setLoading,
  setError,
} = clientsSlice.actions;

export default clientsSlice.reducer;
