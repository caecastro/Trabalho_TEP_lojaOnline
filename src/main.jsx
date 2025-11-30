import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { store, loadInitialData } from "./store/index.js";
import App from "./App.jsx";
import Products from "./pages/Products.jsx";
import Clients from "./pages/Clients.jsx";
import "./index.css";

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
