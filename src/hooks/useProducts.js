import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../services/api.js";
import {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} from "../store/slices/productSlice.js";

export const useProducts = () => {
  const dispatch = useDispatch();
  const {
    list: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [apiProducts, setApiProducts] = useState([]);

  // Carregar produtos da API
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

  // Adicionar produto local
  const addProductToStore = async (productData) => {
    try {
      dispatch(addProduct(productData));
      return productData;
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      throw new Error("Falha ao salvar produto");
    }
  };

  // Editar produto
  const editProductInStore = async (productId, productData) => {
    try {
      dispatch(updateProduct({ id: productId, data: productData }));
      return productData;
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      throw new Error("Falha ao editar produto");
    }
  };

  // Excluir produto
  const deleteProductFromStore = async (productId) => {
    try {
      dispatch(removeProduct(productId));
      return true;
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      throw new Error("Falha ao excluir produto");
    }
  };

  // Combinar produtos da API com produtos locais
  const allProducts = [...apiProducts, ...products.filter((p) => p.isLocal)];

  return {
    products: allProducts,
    apiProducts,
    localProducts: products.filter((p) => p.isLocal),
    loading,
    error,
    loadApiProducts,
    addProduct: addProductToStore,
    editProduct: editProductInStore,
    deleteProduct: deleteProductFromStore,
  };
};
