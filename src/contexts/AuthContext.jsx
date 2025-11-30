import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../services/api";

// Context para gerenciamento de autenticação
const AuthContext = createContext();

/**
 * Hook para acessar contexto de autenticação
 * @returns {Object} Dados e funções de autenticação
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provider para gerenciamento de estado de autenticação
 * Carrega usuário automaticamente e fornece funções de login/logout
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dados mock para fallback em caso de erro na API
  const mockUser = {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
  };

  // Carrega usuário automaticamente ao inicializar
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Busca usuário da API externa
        const userData = await getUser(1);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário da API:", error);
        // Fallback para dados mock em caso de falha
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Define usuário como logado
  const login = (userData) => setUser(userData);

  // Remove usuário (logout)
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user, // Dados do usuário atual
        login, // Função para fazer login
        logout, // Função para fazer logout
        loading, // Estado de carregamento
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
