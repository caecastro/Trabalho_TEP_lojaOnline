import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";

/**
 * Hook personalizado para gerenciamento do carrinho de compras
 * Fornece operações para adicionar, remover e calcular totais
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  // Adiciona produto ao carrinho ou incrementa quantidade
  const addItemToCart = (product) => {
    dispatch(addItem(product));
  };

  // Remove produto específico do carrinho
  const removeItemFromCart = (productId) => {
    dispatch(removeItem(productId));
  };

  // Atualiza quantidade de produto (mínimo 1)
  const updateItemQuantity = (productId, quantity) => {
    dispatch(
      updateQuantity({ id: productId, quantity: Math.max(1, quantity) })
    );
  };

  // Esvazia todo o carrinho
  const clearCartItems = () => {
    dispatch(clearCart());
  };

  // Calcula preço total baseado nos itens e quantidades
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calcula quantidade total de itens no carrinho
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items, // Array de itens no carrinho
    addItem: addItemToCart, // Adicionar item
    removeItem: removeItemFromCart, // Remover item
    updateQuantity: updateItemQuantity, // Atualizar quantidade
    clearCart: clearCartItems, // Limpar carrinho
    getTotalPrice, // Calcular preço total
    getTotalItems, // Calcular quantidade total
  };
};
