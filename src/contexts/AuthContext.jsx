import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Buscar usuário da API real
        const userData = await getUser(1);
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user from API:", error);
        // Fallback para dados mock em caso de erro
        setUser({
          id: 1,
          name: "John Doe",
          username: "johndoe",
          email: "john.doe@example.com",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
