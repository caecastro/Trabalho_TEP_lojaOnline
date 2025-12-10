import { useState, useEffect, useCallback } from "react";
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

// Carrega dados do localStorage de forma segura
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
    return defaultValue;
  }
};

export const useProducts = () => {
  const dispatch = useDispatch();
  const {
    list: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [apiProducts, setApiProducts] = useState([]);

  // Estados carregados do localStorage
  const [editedApiProducts, setEditedApiProductsState] = useState(() =>
    loadFromStorage(EDITED_API_PRODUCTS_KEY, {})
  );

  const [deletedApiProducts, setDeletedApiProductsState] = useState(() =>
    loadFromStorage(DELETED_API_PRODUCTS_KEY, [])
  );

  // Funções para salvar no localStorage sincronamente
  const setEditedApiProducts = useCallback((newEditedProducts) => {
    setEditedApiProductsState(newEditedProducts);
    localStorage.setItem(
      EDITED_API_PRODUCTS_KEY,
      JSON.stringify(newEditedProducts)
    );
  }, []);

  const setDeletedApiProducts = useCallback((newDeletedProducts) => {
    setDeletedApiProductsState(newDeletedProducts);
    localStorage.setItem(
      DELETED_API_PRODUCTS_KEY,
      JSON.stringify(newDeletedProducts)
    );
  }, []);

  const loadApiProducts = useCallback(
    async (limit = 5) => {
      try {
        dispatch(setLoading(true));
        const data = await api.getProducts(limit);

        // Filtra os produtos excluídos
        const nonDeletedData = data.filter(
          (product) => !deletedApiProducts.includes(product.id)
        );

        // Aplica edições aos produtos
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
              // Garante que o ID seja o original para edições
              id: product.id, // Mantém o ID original da API para edições
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
    },
    [deletedApiProducts, editedApiProducts, dispatch]
  );

  // Recarrega produtos quando editedApiProducts ou deletedApiProducts mudam
  useEffect(() => {
    if (apiProducts.length > 0) {
      loadApiProducts(20);
    }
  }, [editedApiProducts, deletedApiProducts]);

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
      // Verifica se é um produto da API (incluindo já editado)
      const productToEdit = [...apiProducts, ...products].find(
        (p) => p.id === productId || p.originalApiId === productId
      );

      if (!productToEdit) {
        throw new Error("Produto não encontrado");
      }

      // Determina o ID original da API
      const actualApiId = productToEdit.originalApiId || productToEdit.id;

      if (!productToEdit.isLocal) {
        // Produto da API - salva edição
        const updatedEdits = {
          ...editedApiProducts,
          [actualApiId]: {
            ...productData,
            editedAt: new Date().toISOString(),
            // Garante que todos os campos necessários estão presentes
            title: productData.title,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image: productData.image,
          },
        };

        setEditedApiProducts(updatedEdits);

        // Atualiza a lista local imediatamente
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
      } else {
        // Produto local
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
      const originalApiId = product.originalApiId || productId;

      if (product.isEditedApiProduct) {
        // Remove edição
        const { [originalApiId]: removed, ...rest } = editedApiProducts;
        setEditedApiProducts(rest);
      } else if (!product.isLocal) {
        // Produto da API não editado - marca como excluído
        if (!deletedApiProducts.includes(originalApiId)) {
          const updatedDeletedProducts = [...deletedApiProducts, originalApiId];
          setDeletedApiProducts(updatedDeletedProducts);
        }
      } else {
        // Produto local
        dispatch(removeProduct(productId));
      }

      // Remove do carrinho
      dispatch(removeItem(productId));

      return true;
    } catch (err) {
      throw new Error("Falha ao excluir produto");
    }
  };

  // Combina produtos da API com produtos locais
  const getCombinedProducts = useCallback(() => {
    const uniqueApiProducts = apiProducts.filter((apiProduct) => {
      // Se for produto editado, não mostra o original
      if (apiProduct.isEditedApiProduct && apiProduct.originalApiId) {
        return !apiProducts.some(
          (p) => p.id === apiProduct.originalApiId && !p.isEditedApiProduct
        );
      }
      // Se for produto original, verifica se não tem edição
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
  }, [apiProducts, products]);

  const restoreAllProducts = () => {
    setEditedApiProducts({});
    setDeletedApiProducts([]);
  };

  const restoreProduct = (productId) => {
    if (editedApiProducts[productId]) {
      // Remove edição
      const { [productId]: removed, ...rest } = editedApiProducts;
      setEditedApiProducts(rest);
    } else if (deletedApiProducts.includes(productId)) {
      // Remove da lista de excluídos
      const updatedDeleted = deletedApiProducts.filter(
        (id) => id !== productId
      );
      setDeletedApiProducts(updatedDeleted);
    }
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
