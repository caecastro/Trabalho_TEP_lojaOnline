import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockUser = {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(1);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário da API:", error);
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
