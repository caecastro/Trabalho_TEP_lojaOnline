import { createSlice } from "@reduxjs/toolkit";

// Função para gerar data aleatória nos últimos 5 anos
const generateRandomDate = () => {
  const currentDate = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

  const randomTime =
    fiveYearsAgo.getTime() +
    Math.random() * (currentDate.getTime() - fiveYearsAgo.getTime());
  return new Date(randomTime).toISOString().split("T")[0];
};

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
    setClients: (state, action) => {
      state.list = action.payload;
    },
    addClient: (state, action) => {
      const newClient = {
        ...action.payload,
        contactAt: generateRandomDate(),
      };
      state.list.push(newClient);
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
