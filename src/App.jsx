import React from "react";
import Controller from "./components/views/Controller";
import Produtos from "./components/assets/Produtos";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Cabeçalho */}
      <Controller />

      {/* Conteúdo principal */}
      <main className="flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Welcome to the Shop
        </h1>
        <h2 className="text-xl font-medium text-gray-700 mb-10 text-center">
          Top 5 Products
        </h2>

        {/* Produtos */}
        <Produtos />
      </main>

      {/* Rodapé */}
      <footer className="w-full text-center py-6 border-t border-gray-300 text-gray-600">
        IPSC ©2023 Created by Lidiane Valentim
      </footer>
    </div>
  );
}
