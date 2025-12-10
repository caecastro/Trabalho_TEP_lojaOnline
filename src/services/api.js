const BASE_URL = "https://fakestoreapi.com";
const USERS_URL = "https://jsonplaceholder.typicode.com";
const MOCK_URL = "/api"; // Para o MirageJS

// Configuração do axios
import axios from "axios";

// Cria instância base
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para debug
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Função utilitária para fetch com tratamento de erro
const fetchData = async (url) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

// API para produtos - FakeStore API
export const api = {
  // Busca produtos com limite opcional
  getProducts: (limit = null) => {
    const url = limit
      ? `${BASE_URL}/products?limit=${limit}`
      : `${BASE_URL}/products`;
    return fetchData(url);
  },

  // Busca produto específico por ID
  getProduct: (id) => fetchData(`${BASE_URL}/products/${id}`),

  // Busca todas as categorias disponíveis
  getCategories: () => fetchData(`${BASE_URL}/products/categories`),

  // Busca produtos por categoria
  getProductsByCategory: (category) =>
    fetchData(`${BASE_URL}/products/category/${category}`),

  // ===== NOVAS FUNÇÕES PARA CLIENTES MOCKADOS =====

  // Busca clientes do mock
  getClients: () => axiosInstance.get(`${MOCK_URL}/clients`),

  // Busca cliente específico
  getClient: (id) => axiosInstance.get(`${MOCK_URL}/clients/${id}`),

  // Cria novo cliente
  createClient: (clientData) =>
    axiosInstance.post(`${MOCK_URL}/clients`, clientData),

  // Atualiza cliente
  updateClient: (id, clientData) =>
    axiosInstance.put(`${MOCK_URL}/clients/${id}`, clientData),

  // Atualização parcial
  patchClient: (id, clientData) =>
    axiosInstance.patch(`${MOCK_URL}/clients/${id}`, clientData),

  // Remove cliente
  deleteClient: (id) => axiosInstance.delete(`${MOCK_URL}/clients/${id}`),
};

// API para usuários - JSONPlaceholder (existente)
export const getUser = (id = 1) => fetchData(`${USERS_URL}/users/${id}`);

// Busca múltiplos usuários em paralelo (existente)
export const getMultipleUsers = (count = 10) => {
  const userPromises = Array.from({ length: count }, (_, i) => getUser(i + 1));
  return Promise.all(userPromises);
};

// Exporta axios instance para uso em outros lugares
export { axiosInstance };
