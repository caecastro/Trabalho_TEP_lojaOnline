import Controller from "./components/views/Controller";
import Produtos from "./components/assets/Produtos";
import { useTheme } from "./contexts/ThemeContext";

export default function App() {
  const { isDarkMode } = useTheme();

  const themeClasses = {
    bg: isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900",
    text: {
      primary: isDarkMode ? "text-white" : "text-gray-900",
      secondary: isDarkMode ? "text-gray-300" : "text-gray-700",
    },
    border: isDarkMode
      ? "border-gray-700 text-gray-400"
      : "border-gray-300 text-gray-600",
  };

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.bg}`}>
      <Controller />

      <main className="flex flex-col items-center py-6 sm:py-8 md:py-10 px-4 sm:px-6 flex-1">
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center ${themeClasses.text.primary}`}
        >
          Welcome to the Shop
        </h1>
        <h2
          className={`text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 md:mb-10 text-center ${themeClasses.text.secondary}`}
        >
          Top 5 Products
        </h2>

        {/* Container principal ajustado */}
        <div className="w-full max-w-6xl px-3 sm:px-4 md:px-6">
          <Produtos />
        </div>
      </main>

      <footer
        className={`w-full text-center py-4 sm:py-6 border-t text-sm sm:text-base ${themeClasses.border}`}
      >
        IFSC ©2025 Created by Lidiane Visintin
      </footer>
    </div>
  );
}
