import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { store, loadInitialData } from "./store";
import App from "./App";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import "./index.css";

// Inicializa dados persistidos
loadInitialData();

// Configuração de rotas
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

// Renderização principal
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1890ff", // Cor primária da aplicação
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
