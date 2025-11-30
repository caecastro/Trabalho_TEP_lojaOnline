// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; // Redux
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { store } from "./store/index.js"; // Redux store
import App from "./App.jsx";
import Products from "./pages/Products.jsx";
import Clients from "./pages/Clients.jsx";
import "./index.css";

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
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
