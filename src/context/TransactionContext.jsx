import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// Constantes
export const TRANSACTION_TYPES = {
  ENTRADA: "entrada",
  SAIDA: "saida",
};

// Serviço de API
const api = {
  async getTransactionsByYear(year) {
    return window.api.getTransactionsByYear(year);
  },

  async getCategories() {
    return window.api.getCategories();
  },

  async createTransaction(data) {
    return window.api.createTransaction(data);
  },

  async createCategory(name) {
    return window.api.createCategory(name);
  },

  async updateTransaction(id, data) {
    return window.api.updateTransaction(id, data);
  },

  async deleteTransaction(id) {
    return window.api.deleteTransaction(id);
  },

  async openExternal(url) {
    return window.api.openExternal(url);
  },
};

// Contexto
const TransactionContext = createContext();

// Provider
export const TransactionProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear()
  );
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async (year) => {
    try {
      const data = await api.getTransactionsByYear(year);
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      throw error;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      throw error;
    }
  }, []);

  const createTransaction = useCallback(
    async (data) => {
      try {
        const result = await api.createTransaction(data);
        await fetchTransactions(currentYear);
        return result;
      } catch (error) {
        console.error("Erro ao criar transação:", error);
        throw error;
      }
    },
    [currentYear, fetchTransactions]
  );

  const createCategory = useCallback(
    async (name) => {
      try {
        const result = await api.createCategory(name);
        await fetchCategories();
        return result;
      } catch (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
      }
    },
    [fetchCategories]
  );

  const updateTransaction = useCallback(
    async (id, data) => {
      try {
        const result = await api.updateTransaction(id, data);
        await fetchTransactions(currentYear);
        return result;
      } catch (error) {
        console.error("Erro ao atualizar transação:", error);
        throw error;
      }
    },
    [currentYear, fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        await api.deleteTransaction(id);
        await fetchTransactions(currentYear);
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        throw error;
      }
    },
    [currentYear, fetchTransactions]
  );

  const handleYearChange = useCallback((direction) => {
    setCurrentYear((year) => (direction === "next" ? year + 1 : year - 1));
  }, []);

  const openLink = useCallback(async (url) => {
    if (!url) return;
    try {
      await api.openExternal(url);
    } catch (error) {
      console.error("Erro ao abrir link:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTransactions(currentYear), fetchCategories()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentYear, fetchTransactions, fetchCategories]);

  const contextValue = {
    transactions,
    categories,
    loading,
    currentYear,
    fetchTransactions,
    fetchCategories,
    createTransaction,
    createCategory,
    updateTransaction,
    deleteTransaction,
    handleYearChange,
    openLink,
    TRANSACTION_TYPES,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

// Hook personalizado
export const useTransaction = () => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransaction deve ser usado dentro de um TransactionProvider"
    );
  }

  return context;
};
