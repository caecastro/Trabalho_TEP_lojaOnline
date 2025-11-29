import { useState, useEffect } from "react";
import { api } from "../services/api";
import { localStore } from "../utils/localStorage";

export const useProducts = () => {
  const [apiProducts, setApiProducts] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApiProducts = async (limit = 9) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts(limit);
      setApiProducts(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadLocalProducts = () => {
    try {
      const produtosSalvos = localStore.get("produtosExtra");
      if (produtosSalvos) {
        setLocalProducts(Array.isArray(produtosSalvos) ? produtosSalvos : []);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos do localStorage:", err);
    }
  };

  const addProduct = async (productData) => {
    try {
      const novoProduto = {
        id: `local-${Date.now()}`,
        ...productData,
        rating: { rate: 4, count: Math.floor(Math.random() * 500) + 100 },
      };

      const produtosAtuais = localStore.get("produtosExtra") || [];
      const produtosAtualizados = [...produtosAtuais, novoProduto];

      localStore.set("produtosExtra", produtosAtualizados);
      setLocalProducts(produtosAtualizados);

      return novoProduto;
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      throw new Error("Falha ao salvar produto no localStorage");
    }
  };

  const allProducts = [...apiProducts, ...localProducts];

  useEffect(() => {
    loadApiProducts();
    loadLocalProducts();
  }, []);

  return {
    products: allProducts,
    apiProducts,
    localProducts,
    loading,
    error,
    loadApiProducts,
    loadLocalProducts,
    addProduct,
  };
};
