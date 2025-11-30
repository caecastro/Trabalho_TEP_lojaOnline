// utils/localStorage.js

/**
 * Utilitário para operações seguras com localStorage
 * Gerencia dados persistentes com tratamento de erros
 */
export const localStore = {
  // Recupera item do localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erro ao buscar ${key} do localStorage:`, error);
      return null;
    }
  },

  // Salva item no localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  },

  // Remove item específico
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error);
    }
  },

  // Limpa todo o localStorage
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar localStorage:", error);
    }
  },
};
