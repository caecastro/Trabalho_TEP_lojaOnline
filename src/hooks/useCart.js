import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice.js";

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const addItemToCart = (product) => {
    dispatch(addItem(product));
  };

  const removeItemFromCart = (productId) => {
    dispatch(removeItem(productId));
  };

  const updateItemQuantity = (productId, quantity) => {
    dispatch(
      updateQuantity({ id: productId, quantity: Math.max(1, quantity) })
    );
  };

  const clearCartItems = () => {
    dispatch(clearCart());
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    updateQuantity: updateItemQuantity,
    clearCart: clearCartItems,
    getTotalPrice,
    getTotalItems,
  };
};
