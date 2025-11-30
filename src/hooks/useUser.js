import { useState, useEffect } from "react";
import { getUser } from "../services/api";

/**
 * Hook personalizado para gerenciamento de usuário
 * Fornece estado do usuário, carregamento e ações relacionadas
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega dados do usuário da API
  const loadUser = async (id = 1) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUser(id);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpa dados do usuário (logout)
  const logout = () => {
    setUser(null);
  };

  // Carrega usuário automaticamente ao montar o hook
  useEffect(() => {
    loadUser();
  }, []);

  return {
    user, // Dados do usuário atual
    loading, // Estado de carregamento
    error, // Mensagem de erro, se houver
    loadUser, // Função para recarregar usuário
    logout, // Função para fazer logout
  };
};
