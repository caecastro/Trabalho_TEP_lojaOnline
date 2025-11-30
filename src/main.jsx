import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { store } from "./store/index.js";
import { setCart } from "./store/slices/cartSlice.js";
import { setClients } from "./store/slices/clientSlice.js";
import App from "./App.jsx";
import Products from "./pages/Products.jsx";
import Clients from "./pages/Clients.jsx";
import "./index.css";

// Carregar dados do localStorage ao inicializar
const loadInitialData = () => {
  try {
    // Carrinho
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      store.dispatch(setCart(cartItems));
    }

    // Clients
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      store.dispatch(setClients(clients));
    }
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
  }
};

// Salvar dados no localStorage sempre que mudarem
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem("cart", JSON.stringify(state.cart.items));
    localStorage.setItem("clients", JSON.stringify(state.clients.list));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
});

// Carregar dados ao iniciar
loadInitialData();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/clients",
    element: <Clients />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1890ff",
              },
            }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
