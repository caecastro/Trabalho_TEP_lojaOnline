import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../services/api";
import {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} from "../store/slices/productSlice";

/**
 * Hook personalizado para gerenciamento de produtos
 * Combina produtos da API com produtos locais e fornece operações CRUD
 */
export const useProducts = () => {
  const dispatch = useDispatch();
  const {
    list: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const [apiProducts, setApiProducts] = useState([]);

  // Carrega produtos da API externa
  const loadApiProducts = async (limit = 5) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getProducts(limit);
      setApiProducts(data);
      return data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Adiciona novo produto ao store local
  const addProductToStore = async (productData) => {
    try {
      dispatch(addProduct(productData));
      return productData;
    } catch (err) {
      throw new Error("Falha ao salvar produto");
    }
  };

  // Atualiza produto existente no store local
  const editProductInStore = async (productId, productData) => {
    try {
      dispatch(updateProduct({ id: productId, data: productData }));
      return productData;
    } catch (err) {
      throw new Error("Falha ao editar produto");
    }
  };

  // Remove produto do store local
  const deleteProductFromStore = async (productId) => {
    try {
      dispatch(removeProduct(productId));
      return true;
    } catch (err) {
      throw new Error("Falha ao excluir produto");
    }
  };

  // Combina produtos da API com produtos locais para exibição
  const allProducts = [...apiProducts, ...products.filter((p) => p.isLocal)];

  return {
    products: allProducts, // Lista combinada de produtos
    apiProducts, // Produtos da API apenas
    localProducts: products.filter((p) => p.isLocal), // Produtos locais apenas
    loading, // Estado de carregamento
    error, // Mensagem de erro
    loadApiProducts, // Função para carregar produtos da API
    addProduct: addProductToStore, // Adicionar produto local
    editProduct: editProductInStore, // Editar produto local
    deleteProduct: deleteProductFromStore, // Excluir produto local
  };
};
