import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login.jsx";
import Pagina_inicial from "./pages/Pagina_inicial.jsx";
import "./index.css";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Pagina_inicial /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
