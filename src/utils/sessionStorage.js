// utils/sessionStorage.js

/**
 * Utilitário para operações seguras com sessionStorage
 * Inclui tratamento de erros e parse automático de JSON
 */
export const sessionStore = {
  // Recupera item do sessionStorage
  get: (key) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erro ao buscar ${key} do sessionStorage:`, error);
      return null;
    }
  },

  // Salva item no sessionStorage
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no sessionStorage:`, error);
    }
  },

  // Remove item do sessionStorage
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key} do sessionStorage:`, error);
    }
  },

  // Limpa todo o sessionStorage
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar sessionStorage:", error);
    }
  },
};
