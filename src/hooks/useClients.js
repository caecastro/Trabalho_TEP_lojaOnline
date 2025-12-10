import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../services/api";
import {
  setClients,
  addClient,
  updateClient,
  removeClient,
  setLoading,
  setError,
} from "../store/slices/clientSlice";

export const useClients = () => {
  const dispatch = useDispatch();
  const {
    list: clients,
    loading,
    error,
  } = useSelector((state) => state.clients);

  const [initialized, setInitialized] = useState(false);

  // Testa a API mock
  const testMockApi = useCallback(async () => {
    try {
      console.log("🧪 Testando API Mock...");
      const response = await fetch("/api/clients");
      const data = await response.json();
      console.log("✅ API Mock respondendo:", data);
      return true;
    } catch (error) {
      console.error("❌ API Mock não responde:", error);
      return false;
    }
  }, []);

  // Carrega clientes da API mockada
  const loadMockClients = useCallback(async () => {
    try {
      console.log("🔄 Carregando clientes da API Mock...");
      dispatch(setLoading(true));

      // Testa se a API está respondendo
      const apiWorking = await testMockApi();
      if (!apiWorking) {
        throw new Error("API Mock não está respondendo");
      }

      // Busca clientes
      const response = await api.getClients();
      console.log("📦 Resposta da API:", response);

      const clientsData = response.data?.clients || response.data || [];
      console.log(`👥 ${clientsData.length} clientes carregados`);

      if (clientsData.length === 0) {
        console.warn("⚠️ Nenhum cliente retornado da API Mock");
        // Fallback: carrega do localStorage
        const savedClients = JSON.parse(
          localStorage.getItem("clients") || "[]"
        );
        if (savedClients.length > 0) {
          console.log(
            `📂 Carregando ${savedClients.length} clientes do localStorage`
          );
          dispatch(setClients(savedClients));
        }
      } else {
        dispatch(setClients(clientsData));
      }

      setInitialized(true);
      return clientsData;
    } catch (err) {
      console.error("💥 Erro ao carregar clientes:", err);
      dispatch(setError(err.message));

      // Fallback direto do localStorage
      const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
      if (savedClients.length > 0) {
        console.log(
          `🔄 Fallback: ${savedClients.length} clientes do localStorage`
        );
        dispatch(setClients(savedClients));
      }

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, testMockApi]);

  // Adiciona cliente via API mockada
  const addMockClient = async (clientData) => {
    try {
      dispatch(setLoading(true));
      console.log("➕ Adicionando cliente via API Mock:", clientData);

      const response = await api.createClient(clientData);
      const newClient = response.data?.client || response.data;
      console.log("✅ Cliente criado:", newClient);

      dispatch(addClient(newClient));
      return newClient;
    } catch (err) {
      console.error("❌ Erro ao criar cliente:", err);
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Atualiza cliente via API mockada
  const updateMockClient = async (id, clientData) => {
    try {
      dispatch(setLoading(true));
      console.log(`✏️ Atualizando cliente ${id}:`, clientData);

      const response = await api.updateClient(id, clientData);
      const updatedClient = response.data?.client || response.data;
      console.log("✅ Cliente atualizado:", updatedClient);

      dispatch(updateClient({ id, data: updatedClient }));
      return updatedClient;
    } catch (err) {
      console.error("❌ Erro ao atualizar cliente:", err);
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Remove cliente via API mockada
  const deleteMockClient = async (id) => {
    try {
      dispatch(setLoading(true));
      console.log(`🗑️ Removendo cliente ${id}`);

      await api.deleteClient(id);
      dispatch(removeClient(id));
      console.log("✅ Cliente removido");

      return true;
    } catch (err) {
      console.error("❌ Erro ao remover cliente:", err);
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Força recarregamento dos clientes
  const refreshClients = async () => {
    console.log("🔄 Forçando recarregamento de clientes...");
    return loadMockClients();
  };

  // Carrega clientes ao montar
  useEffect(() => {
    if (!initialized) {
      console.log("🏁 Inicializando hook useClients...");
      loadMockClients();
    }
  }, [loadMockClients, initialized]);

  return {
    clients,
    loading,
    error,
    initialized,
    loadMockClients: refreshClients,
    addMockClient,
    updateMockClient,
    deleteMockClient,
    testMockApi,
  };
};
