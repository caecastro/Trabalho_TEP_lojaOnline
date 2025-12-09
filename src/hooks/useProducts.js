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

// Chave para armazenar edições no localStorage
const EDITED_API_PRODUCTS_KEY = "editedApiProducts";

export const useProducts = () => {
  const dispatch = useDispatch();
  const {
    list: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [apiProducts, setApiProducts] = useState([]);
  const [editedApiProducts, setEditedApiProducts] = useState(() => {
    // Carrega edições salvas do localStorage
    const saved = localStorage.getItem(EDITED_API_PRODUCTS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Salva edições no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(
      EDITED_API_PRODUCTS_KEY,
      JSON.stringify(editedApiProducts)
    );
  }, [editedApiProducts]);

  const loadApiProducts = async (limit = 5) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getProducts(limit);

      // Aplica edições salvas aos produtos da API
      const productsWithEdits = data.map((product) => {
        if (editedApiProducts[product.id]) {
          return {
            ...product,
            ...editedApiProducts[product.id],
            isEditedApiProduct: true,
            editedAt:
              editedApiProducts[product.id].editedAt ||
              new Date().toISOString(),
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
        id: Date.now().toString(),
        isLocal: true,
        createdAt: new Date().toISOString(),
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
      const isApiProduct = apiProducts.some(
        (p) => p.id === productId || p.originalApiId === productId
      );

      if (isApiProduct) {
        // Encontra o produto original da API
        const originalProduct = apiProducts.find(
          (p) => p.id === productId || p.originalApiId === productId
        );
        const actualApiId = originalProduct.originalApiId || originalProduct.id;

        // Salva as edições no mapa
        const updatedEdits = {
          ...editedApiProducts,
          [actualApiId]: {
            ...productData,
            editedAt: new Date().toISOString(),
          },
        };

        setEditedApiProducts(updatedEdits);

        // Atualiza a lista de produtos da API imediatamente
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
            };
          }
          return product;
        });

        setApiProducts(updatedApiProducts);

        return productData;
      } else {
        // Produto local - atualiza normalmente
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

  const deleteProductFromStore = async (productId) => {
    try {
      // Verifica se é um produto da API editado
      const editedProduct = apiProducts.find(
        (p) =>
          (p.id === productId && p.isEditedApiProduct) ||
          p.originalApiId === productId
      );

      if (editedProduct) {
        const apiId = editedProduct.originalApiId || editedProduct.id;

        // Remove do mapa de edições
        const { [apiId]: removed, ...rest } = editedApiProducts;
        setEditedApiProducts(rest);

        // Remove da lista de produtos da API
        const updatedApiProducts = apiProducts.filter(
          (p) =>
            p.id !== productId &&
            (p.originalApiId !== apiId || !p.isEditedApiProduct)
        );

        // Se o produto foi apenas editado (não deletado), restaura o original
        if (apiProducts.some((p) => p.id === apiId && !p.isEditedApiProduct)) {
          // Mantém o produto original (remove apenas a edição)
          setApiProducts(updatedApiProducts.filter((p) => p.id !== productId));
        } else {
          // Produto foi completamente removido
          setApiProducts(updatedApiProducts);
        }
      } else {
        // Produto local - remove normalmente
        dispatch(removeProduct(productId));
      }

      return true;
    } catch (err) {
      throw new Error("Falha ao excluir produto");
    }
  };

  // Combina produtos da API (com edições aplicadas) com produtos locais
  const getCombinedProducts = () => {
    // Remove duplicatas - se um produto foi editado, não mostra o original
    const uniqueApiProducts = apiProducts.filter((apiProduct) => {
      // Se este produto é uma edição de outro, verifica se o original ainda está na lista
      if (apiProduct.isEditedApiProduct && apiProduct.originalApiId) {
        return !apiProducts.some(
          (p) => p.id === apiProduct.originalApiId && !p.isEditedApiProduct
        );
      }
      // Se é um produto original, verifica se não há uma versão editada dele
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

  // Função para limpar todas as edições
  const clearAllEdits = () => {
    setEditedApiProducts({});
    // Recarrega os produtos da API sem edições
    loadApiProducts(20);
  };

  return {
    products: getCombinedProducts(),
    apiProducts,
    localProducts: products.filter((p) => p.isLocal && !p.isEditedApiProduct),
    editedApiProducts,
    loading,
    error,
    loadApiProducts,
    addProduct: addProductToStore,
    editProduct: editProductInStore,
    deleteProduct: deleteProductFromStore,
    clearAllEdits,
  };
};
