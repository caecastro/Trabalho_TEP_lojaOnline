const BASE_URL = "https://fakestoreapi.com";

export const api = {
  // Buscar produtos com limite opcional
  getProducts: (limit = null) => {
    const url = limit
      ? `${BASE_URL}/products?limit=${limit}`
      : `${BASE_URL}/products`;
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    });
  },

  // Buscar um produto por ID
  getProduct: (id) =>
    fetch(`${BASE_URL}/products/${id}`).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    }),

  // Buscar todas as categorias
  getCategories: () =>
    fetch(`${BASE_URL}/products/categories`).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }),

  // Buscar produtos por categoria
  getProductsByCategory: (category) =>
    fetch(`${BASE_URL}/products/category/${category}`).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products by category");
      return res.json();
    }),
};

// Buscar usuário
export const getUser = (id = 1) =>
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });

// Buscar múltiplos usuários
export const getMultipleUsers = (count = 10) => {
  const promises = [];
  for (let i = 1; i <= count; i++) {
    promises.push(getUser(i));
  }
  return Promise.all(promises);
};
