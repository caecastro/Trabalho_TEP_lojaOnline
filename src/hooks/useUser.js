import { useState, useEffect } from "react";
import { getUser } from "../services/api"; // ← CORRETO!

// ... resto do código permanece igual
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    loadUser,
    logout,
  };
};
