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
import { removeItem } from "../store/slices/cartSlice";

// Chaves para armazenar estado dos produtos
const EDITED_API_PRODUCTS_KEY = "editedApiProducts";
const DELETED_API_PRODUCTS_KEY = "deletedApiProducts";

export const useProducts = () => {
  const dispatch = useDispatch();
  const {
    list: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [apiProducts, setApiProducts] = useState([]);

  // Carregar estados do localStorage
  const [editedApiProducts, setEditedApiProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(EDITED_API_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [deletedApiProducts, setDeletedApiProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(DELETED_API_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Função auxiliar para salvar no localStorage
  const saveEditedApiProducts = (editedProducts) => {
    setEditedApiProducts(editedProducts);
    localStorage.setItem(
      EDITED_API_PRODUCTS_KEY,
      JSON.stringify(editedProducts)
    );
  };

  const saveDeletedApiProducts = (deletedProducts) => {
    setDeletedApiProducts(deletedProducts);
    localStorage.setItem(
      DELETED_API_PRODUCTS_KEY,
      JSON.stringify(deletedProducts)
    );
  };

  const loadApiProducts = async (limit = 5) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getProducts(limit);

      const nonDeletedData = data.filter(
        (product) => !deletedApiProducts.includes(product.id)
      );

      const productsWithEdits = nonDeletedData.map((product) => {
        if (editedApiProducts[product.id]) {
          return {
            ...product,
            ...editedApiProducts[product.id],
            isEditedApiProduct: true,
            editedAt:
              editedApiProducts[product.id].editedAt ||
              new Date().toISOString(),
            originalApiId: product.id,
          };
        }
        return product;
      });

      setApiProducts(productsWithEdits);
      return productsWithEdits;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addProductToStore = async (productData) => {
    try {
      const productWithId = {
        ...productData,
        id: `local-${Date.now()}`,
        isLocal: true,
        createdAt: new Date().toISOString(),
        rating: {
          rate: 4,
          count: Math.floor(Math.random() * 500) + 100,
        },
      };
      dispatch(addProduct(productWithId));
      return productWithId;
    } catch (err) {
      throw new Error("Falha ao salvar produto");
    }
  };

  const editProductInStore = async (productId, productData) => {
    try {
      const isApiProduct = apiProducts.some(
        (p) => p.id === productId || p.originalApiId === productId
      );

      if (isApiProduct) {
        const originalProduct = apiProducts.find(
          (p) => p.id === productId || p.originalApiId === productId
        );
        const actualApiId = originalProduct.originalApiId || originalProduct.id;

        const updatedEdits = {
          ...editedApiProducts,
          [actualApiId]: {
            ...productData,
            editedAt: new Date().toISOString(),
          },
        };

        saveEditedApiProducts(updatedEdits);

        const updatedApiProducts = apiProducts.map((product) => {
          if (
            product.id === productId ||
            product.originalApiId === actualApiId
          ) {
            return {
              ...product,
              ...productData,
              isEditedApiProduct: true,
              editedAt: new Date().toISOString(),
              originalApiId: actualApiId,
            };
          }
          return product;
        });

        setApiProducts(updatedApiProducts);

        return productData;
      } else {
        dispatch(
          updateProduct({
            id: productId,
            data: { ...productData, updatedAt: new Date().toISOString() },
          })
        );
      }

      return productData;
    } catch (err) {
      throw new Error("Falha ao editar produto");
    }
  };

  const deleteProductFromStore = async (product) => {
    try {
      const productId = product.id;
      const isEditedApiProduct = product.isEditedApiProduct;
      const originalApiId = product.originalApiId || productId;

      if (isEditedApiProduct) {
        // Remove edição
        const { [originalApiId]: removed, ...rest } = editedApiProducts;
        saveEditedApiProducts(rest);

        // Remove da lista de produtos da API
        const updatedApiProducts = apiProducts.filter(
          (p) => p.id !== productId
        );
        setApiProducts(updatedApiProducts);
      } else if (!product.isLocal) {
        // Produto da API não editado - marca como excluído
        const updatedDeletedProducts = [...deletedApiProducts, originalApiId];
        saveDeletedApiProducts(updatedDeletedProducts);

        // Remove da lista de produtos da API
        const updatedApiProducts = apiProducts.filter(
          (p) => p.id !== productId && p.originalApiId !== originalApiId
        );
        setApiProducts(updatedApiProducts);
      } else {
        // Produto local - remove normalmente
        dispatch(removeProduct(productId));
      }

      // Remove do carrinho
      dispatch(removeItem(productId));

      return true;
    } catch (err) {
      throw new Error("Falha ao excluir produto");
    }
  };

  const getCombinedProducts = () => {
    const uniqueApiProducts = apiProducts.filter((apiProduct) => {
      if (apiProduct.isEditedApiProduct && apiProduct.originalApiId) {
        return !apiProducts.some(
          (p) => p.id === apiProduct.originalApiId && !p.isEditedApiProduct
        );
      }
      if (!apiProduct.isEditedApiProduct) {
        return !apiProducts.some(
          (p) => p.originalApiId === apiProduct.id && p.isEditedApiProduct
        );
      }
      return true;
    });

    const localProducts = products.filter(
      (p) => p.isLocal && !p.isEditedApiProduct
    );

    return [...uniqueApiProducts, ...localProducts];
  };

  const restoreAllProducts = () => {
    saveEditedApiProducts({});
    saveDeletedApiProducts([]);
    loadApiProducts(20);
  };

  const restoreProduct = (productId) => {
    if (editedApiProducts[productId]) {
      const { [productId]: removed, ...rest } = editedApiProducts;
      saveEditedApiProducts(rest);
    } else if (deletedApiProducts.includes(productId)) {
      const updatedDeleted = deletedApiProducts.filter(
        (id) => id !== productId
      );
      saveDeletedApiProducts(updatedDeleted);
    }

    loadApiProducts(20);
  };

  return {
    products: getCombinedProducts(),
    apiProducts,
    localProducts: products.filter((p) => p.isLocal && !p.isEditedApiProduct),
    editedApiProducts,
    deletedApiProducts,
    loading,
    error,
    loadApiProducts,
    addProduct: addProductToStore,
    editProduct: editProductInStore,
    deleteProduct: deleteProductFromStore,
    restoreAllProducts,
    restoreProduct,
  };
};
