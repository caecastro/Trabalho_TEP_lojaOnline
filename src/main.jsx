import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login.jsx";
import PaginaInicial from "./pages/Pagina_inicial.jsx";
import "./index.css";

// Roteamento simples baseado na URL
const App = () => {
  const path = window.location.pathname;

  if (path === "/home") {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return isAuthenticated ? <PaginaInicial /> : <Login />;
  }

  return <Login />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
