import Controller from "./components/views/Controller.jsx";
import Produtos from "./components/assets/Produtos.jsx";
import { useTheme } from "./contexts/ThemeContext.jsx";

export default function App() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Controller />

      <main className="flex flex-col items-center py-10 px-4 flex-1">
        <h1
          className={`text-3xl font-semibold mb-2 text-center ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to the Shop
        </h1>
        <h2
          className={`text-xl font-medium mb-8 text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Top 5 Products
        </h2>

        <div className="w-full max-w-6xl">
          <Produtos />
        </div>
      </main>

      <footer
        className={`w-full text-center py-6 border-t ${
          isDarkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-600"
        }`}
      >
        IFSC ©2025 Created by Lidiane Visintin
      </footer>
    </div>
  );
}
