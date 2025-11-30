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

  const loadApiProducts = async (limit = 9) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getProducts(limit);
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addProductToStore = async (productData) => {
    try {
      const novoProduto = {
        id: `local-${Date.now()}`,
        ...productData,
        rating: {
          rate: 4,
          count: Math.floor(Math.random() * 500) + 100,
        },
      };

      dispatch(addProduct(novoProduto));
      return novoProduto;
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      throw new Error("Falha ao salvar produto");
    }
  };

  const editProductInStore = async (productId, productData) => {
    try {
      dispatch(updateProduct({ id: productId, data: productData }));
      return productData;
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      throw new Error("Falha ao editar produto");
    }
  };

  const deleteProductFromStore = async (productId) => {
    try {
      dispatch(removeProduct(productId));
      return true;
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      throw new Error("Falha ao excluir produto");
    }
  };

  useEffect(() => {
    loadApiProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadApiProducts,
    addProduct: addProductToStore,
    editProduct: editProductInStore,
    deleteProduct: deleteProductFromStore,
  };
};
