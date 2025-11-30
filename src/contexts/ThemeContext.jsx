import React, { createContext, useState, useContext, useEffect } from "react";
import { ConfigProvider } from "antd";

// Context para gerenciamento de tema
const ThemeContext = createContext();

/**
 * Hook para acessar o contexto de tema
 * @throws {Error} Se usado fora do ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * Provider para gerenciamento de tema claro/escuro
 * Integra com Ant Design e persiste preferência no localStorage
 */
export const ThemeProvider = ({ children }) => {
  // Estado do tema com valor inicial do localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  // Persiste tema no localStorage e aplica classes CSS
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Aplica classes de tema no body para estilização global
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  // Alterna entre temas claro e escuro
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Configuração do tema para componentes Ant Design
  const themeConfig = {
    token: {
      colorPrimary: "#1890ff",
      colorBgBase: isDarkMode ? "#0f0f0f" : "#ffffff",
      colorTextBase: isDarkMode ? "#ffffff" : "#000000",
      colorBgContainer: isDarkMode ? "#1f1f1f" : "#ffffff",
      colorBorder: isDarkMode ? "#434343" : "#d9d9d9",
      colorBgLayout: isDarkMode ? "#000000" : "#f5f5f5",
    },
    components: {
      Table: {
        colorBgContainer: isDarkMode ? "#1f1f1f" : "#ffffff",
        colorText: isDarkMode ? "#ffffff" : "#000000",
        colorBorderSecondary: isDarkMode ? "#434343" : "#f0f0f0",
      },
      Card: {
        colorBgContainer: isDarkMode ? "#1f1f1f" : "#ffffff",
      },
      Drawer: {
        colorBgElevated: isDarkMode ? "#1f1f1f" : "#ffffff",
      },
      Modal: {
        colorBgElevated: isDarkMode ? "#1f1f1f" : "#ffffff",
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
