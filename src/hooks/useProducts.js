// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { localStore } from "../utils/localStorage.js";

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

  // NOVO: Editar produto
  const editProduct = async (productId, productData) => {
    try {
      const produtosAtuais = localStore.get("produtosExtra") || [];
      const produtosAtualizados = produtosAtuais.map((product) =>
        product.id === productId ? { ...product, ...productData } : product
      );

      localStore.set("produtosExtra", produtosAtualizados);
      setLocalProducts(produtosAtualizados);

      return productData;
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      throw new Error("Falha ao editar produto no localStorage");
    }
  };

  // NOVO: Excluir produto
  const deleteProduct = async (productId) => {
    try {
      const produtosAtuais = localStore.get("produtosExtra") || [];
      const produtosAtualizados = produtosAtuais.filter(
        (product) => product.id !== productId
      );

      localStore.set("produtosExtra", produtosAtualizados);
      setLocalProducts(produtosAtualizados);

      return true;
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      throw new Error("Falha ao excluir produto do localStorage");
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
    editProduct, // NOVO
    deleteProduct, // NOVO
  };
};
