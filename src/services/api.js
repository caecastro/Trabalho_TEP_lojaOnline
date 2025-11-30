const BASE_URL = "https://fakestoreapi.com";
const USERS_URL = "https://jsonplaceholder.typicode.com";

// Função utilitária para fetch com tratamento de erro
const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro na requisição: ${url}`);
  return response.json();
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
};

// API para usuários - JSONPlaceholder
export const getUser = (id = 1) => fetchData(`${USERS_URL}/users/${id}`);

// Busca múltiplos usuários em paralelo
export const getMultipleUsers = (count = 10) => {
  const userPromises = Array.from({ length: count }, (_, i) => getUser(i + 1));
  return Promise.all(userPromises);
};
